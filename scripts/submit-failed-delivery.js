/**
 * Submit a Cat C delivery (high contamination) via Guardian API
 * and have VVB reject it — creates a "failed" entry in the impact graph.
 *
 * Usage: node scripts/submit-failed-delivery.js
 */

const GUARDIAN_URL = 'https://eggologic-proxy.sargas.workers.dev/api/v1';
const POLICY_ID = '69bc4638e755119d0774dd03';
const PP_DELIVERY_FORM = 'b322eaa1-7611-4704-be60-b033db83dadb';
const VVB_DELIVERY = '3a5afd50-d4a5-49ca-866b-75477790ae4c';
const VVB_DELIVERY_APPROVE = '337cef47-e484-48bb-9249-a952cb72f203';

async function login(email) {
  console.log(`Logging in as ${email}...`);
  const res = await fetch(`${GUARDIAN_URL}/accounts/loginByEmail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'test' }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  const refreshToken = data.login?.refreshToken || data.refreshToken;

  const tokenRes = await fetch(`${GUARDIAN_URL}/accounts/access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!tokenRes.ok) throw new Error(`Access token failed: ${tokenRes.status}`);
  const { accessToken } = await tokenRes.json();
  console.log('  Login OK');
  return accessToken;
}

async function main() {
  // Step 1: Login as PP and submit a Cat C delivery
  const ppToken = await login('eggologic-proponent@outlook.com');

  const deliveryId = `ENT-${String(Date.now()).slice(-3)}`;
  const bruto = 187;
  const impropios = 38; // ~20% contamination → Cat C
  const netos = bruto - impropios;
  const ajustados = netos * 0.70;
  const ratio = ((impropios / bruto) * 100).toFixed(1);

  console.log(`\nSubmitting ${deliveryId} (Cat C — ${ratio}% contamination)...`);
  const submitRes = await fetch(`${GUARDIAN_URL}/policies/${POLICY_ID}/blocks/${PP_DELIVERY_FORM}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ppToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: {
        field0: 'EWD-RB', field1: '0.3', field2: 'v0.3', field3: 'v0.3',
        field4: deliveryId, field5: 'SUP-001', field6: new Date().toISOString(),
        field7: 'food_waste_mixed', field8: bruto, field9: impropios,
        field10: parseFloat(ratio), field11: parseFloat(netos.toFixed(2)),
        field12: parseFloat(ajustados.toFixed(2)), field13: 'C',
        field14: true, field15: ['https://evidence.eggologic.com/test-fail'],
        field16: 'Submitted', field17: ['https://evidence.eggologic.com/test-fail'],
      },
      ref: null,
    }),
  });

  if (!submitRes.ok) {
    const body = await submitRes.text();
    throw new Error(`Submit failed: ${submitRes.status} — ${body}`);
  }
  console.log(`  ${deliveryId} submitted to Guardian`);

  // Step 2: Wait for Guardian to process
  console.log('\nWaiting 5s for Guardian to index...');
  await new Promise(r => setTimeout(r, 5000));

  // Step 3: Login as VVB and reject the delivery
  const vvbToken = await login('eggologic-vvb@outlook.com');

  console.log('\nFetching VVB delivery queue...');
  const docsRes = await fetch(`${GUARDIAN_URL}/policies/${POLICY_ID}/blocks/${VVB_DELIVERY}`, {
    headers: { 'Authorization': `Bearer ${vvbToken}` },
  });
  if (!docsRes.ok) throw new Error(`VVB docs fetch failed: ${docsRes.status}`);
  const docsData = await docsRes.json();

  const allDocs = docsData.data || docsData.documents || (Array.isArray(docsData) ? docsData : []);
  console.log(`  Found ${allDocs.length} documents in VVB queue`);

  const target = allDocs.find(d => {
    const cs = d.document?.credentialSubject;
    const subj = Array.isArray(cs) ? cs[0] : cs;
    return subj?.field4 === deliveryId;
  });

  if (!target) {
    console.log(`  ${deliveryId} not found in VVB queue yet. You may need to reject it manually.`);
    console.log('  Documents found:', allDocs.map(d => {
      const cs = d.document?.credentialSubject;
      const subj = Array.isArray(cs) ? cs[0] : cs;
      return subj?.field4;
    }));
    return;
  }

  // Reject: Button_1 = reject (Button_0 = approve)
  console.log(`\nRejecting ${deliveryId} as VVB...`);
  const rejectRes = await fetch(`${GUARDIAN_URL}/policies/${POLICY_ID}/blocks/${VVB_DELIVERY_APPROVE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vvbToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tag: 'Button_1', document: target }),
  });

  if (!rejectRes.ok) {
    console.log(`  Reject returned ${rejectRes.status} (may still have worked — check impact page)`);
  } else {
    console.log(`  ${deliveryId} REJECTED — should appear as failed in impact graph`);
  }

  console.log('\nDone! Refresh impact.html to see the failed delivery in the graph.');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
