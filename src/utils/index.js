export const calculateProfit = (recentCapital) => {
  // Balance before the trade
  const balanceBeforeTrade = recentCapital;

  // Calculate trading capital (1% of recent capital)
  const tradingCapital = recentCapital * 0.01;

  // Calculate trading profit (88% of trading capital)
  const profitFromTrade = tradingCapital * 0.88;

  // Calculate balance after trade (original balance + profit)
  const balanceAfterTrade = balanceBeforeTrade + profitFromTrade;

  return {
    balanceBeforeTrade,
    tradingCapital,
    profitFromTrade,
    balanceAfterTrade,
  };
};
