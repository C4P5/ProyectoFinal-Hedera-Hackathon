// Eggologic Dashboard — Hedera Mirror Node Queries

const HederaMirror = (() => {

  async function _get(path) {
    const res = await fetch(`${CONFIG.MIRROR_URL}${path}`);
    if (!res.ok) throw new Error(`Mirror Node ${path}: ${res.status}`);
    return res.json();
  }

  /**
   * Get EGGOCOIN balance for a Hedera account.
   * Returns the balance as a number, or 0 if no balance found.
   */
  async function getEggocoinBalance(accountId) {
    const data = await _get(`/api/v1/tokens/${CONFIG.EGGOCOIN_TOKEN}/balances?account.id=${accountId}`);
    if (data.balances && data.balances.length > 0) {
      return data.balances[0].balance;
    }
    return 0;
  }

  /**
   * Get token info (name, symbol, total supply, decimals).
   */
  async function getTokenInfo(tokenId) {
    return _get(`/api/v1/tokens/${tokenId}`);
  }

  /**
   * Get EGGOCOIN total supply.
   */
  async function getEggocoinSupply() {
    const info = await getTokenInfo(CONFIG.EGGOCOIN_TOKEN);
    return {
      totalSupply: parseInt(info.total_supply, 10),
      name: info.name,
      symbol: info.symbol,
      decimals: parseInt(info.decimals, 10),
      createdTimestamp: parseFloat(info.created_timestamp) * 1000,
    };
  }

  /**
   * Get EGGOCOIN transfers for an account.
   * Follows pagination to collect all EGGOCOIN txs (not just the first page).
   * Finds the transfer entry matching the queried account so amount sign is correct.
   */
  async function getTransactions(accountId, targetCount = 50) {
    let allTxs = [];
    let nextPath = `/api/v1/transactions?account.id=${accountId}&transactiontype=CRYPTOTRANSFER&limit=100&order=desc`;

    while (nextPath && allTxs.length < targetCount) {
      const data = await _get(nextPath);
      if (!data.transactions) break;

      data.transactions.forEach(tx => {
        // Find the EGGOCOIN transfer for THIS account (correct sign: + received, - sent)
        const eggTransfer = (tx.token_transfers || []).find(
          t => t.token_id === CONFIG.EGGOCOIN_TOKEN && t.account === accountId
        );
        if (eggTransfer) {
          allTxs.push({
            txId: tx.transaction_id,
            timestamp: tx.consensus_timestamp,
            date: new Date(parseFloat(tx.consensus_timestamp) * 1000),
            memo: atob(tx.memo_base64 || ''),
            eggocoin: {
              account: eggTransfer.account,
              amount: eggTransfer.amount,
            },
            tokenTransfers: tx.token_transfers || [],
          });
        }
      });

      // Follow pagination if we need more results
      nextPath = (allTxs.length < targetCount && data.links?.next) ? data.links.next : null;
    }

    return allTxs.slice(0, targetCount);
  }

  /**
   * Get all EGGOCOIN balances (all holders).
   */
  async function getAllBalances() {
    const data = await _get(`/api/v1/tokens/${CONFIG.EGGOCOIN_TOKEN}/balances`);
    return data.balances || [];
  }

  /**
   * Get NFT holdings for an account.
   */
  async function getNFTs(accountId) {
    const data = await _get(`/api/v1/tokens/${CONFIG.NFT_TOKEN}/nfts?account.id=${accountId}`);
    return data.nfts || [];
  }

  /**
   * Get CIT (Circular Impact NFT) total supply.
   */
  async function getCITSupply() {
    const info = await getTokenInfo(CONFIG.NFT_TOKEN);
    return parseInt(info.total_supply, 10);
  }

  /**
   * Get CIT NFT count for a specific account.
   */
  async function getUserCIT(accountId) {
    const nfts = await getNFTs(accountId);
    return nfts.length;
  }

  /**
   * Get all minted CIT NFTs (serial, holder, timestamp).
   */
  async function getAllCITNfts() {
    const data = await _get(`/api/v1/tokens/${CONFIG.NFT_TOKEN}/nfts?order=desc&limit=25`);
    return (data.nfts || []).map(nft => ({
      serial: nft.serial_number,
      account: nft.account_id,
      timestamp: parseFloat(nft.created_timestamp) * 1000,
    }));
  }

  /**
   * Get all minting events for EGGOCOIN (treasury transfers).
   */
  async function getMintEvents() {
    const info = await getTokenInfo(CONFIG.EGGOCOIN_TOKEN);
    const treasuryId = info.treasury_account_id;
    const data = await _get(
      `/api/v1/transactions?account.id=${treasuryId}&transactiontype=TOKENMINT&limit=100&order=desc`
    );
    // Filter to only EGGOCOIN mints (treasury may mint other tokens from other policies)
    return (data.transactions || []).filter(tx => tx.entity_id === CONFIG.EGGOCOIN_TOKEN);
  }

  return {
    getEggocoinBalance,
    getTokenInfo,
    getEggocoinSupply,
    getTransactions,
    getAllBalances,
    getNFTs,
    getMintEvents,
    getCITSupply,
    getUserCIT,
    getAllCITNfts,
  };
})();
