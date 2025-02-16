const calculateProfit = (recentCapital) => {
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

// const generateWeeklyDetails = (
//   startingCapital = 0,
//   deposits = [],
//   lastWeekEndDate = null
// ) => {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   // If lastWeekEndDate is provided, move to the next Sunday
//   const startDate = lastWeekEndDate
//     ? new Date(new Date(lastWeekEndDate).getTime() + 7 * 24 * 60 * 60 * 1000)
//     : new Date();

//   // Get the date of the most recent Sunday for the new week
//   const sundayDate = new Date(startDate);
//   sundayDate.setDate(startDate.getDate() - startDate.getDay());

//   let runningCapital = startingCapital;
//   const weeklyDetails = [];

//   const hasValidDeposit =
//     depositedAmount && depositBonus && depositDate && whenDepositHappened;

//   for (let i = 0; i < 7; i++) {
//     const date = new Date(sundayDate);
//     date.setDate(sundayDate.getDate() + i);

//     let isDepositDay = false;
//     let depositInfo = null;

//     if (hasValidDeposit) {
//       try {
//         const currentDate = date.toISOString().split("T")[0];
//         const depositDateTime = new Date(depositDate);

//         if (!isNaN(depositDateTime.getTime())) {
//           isDepositDay =
//             currentDate === depositDateTime.toISOString().split("T")[0];
//           if (isDepositDay) {
//             depositInfo = { depositedAmount, depositBonus };
//           }
//         }
//       } catch (error) {
//         console.warn("Invalid deposit date provided");
//       }
//     }

//     const dayProfits = calculateDayProfits(
//       runningCapital,
//       depositInfo,
//       isDepositDay ? whenDepositHappened : null
//     );

//     const dayDetails = {
//       day: `${days[i]}, ${date.toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })}`,
//       date,
//       ...dayProfits,
//       depositInfo: isDepositDay
//         ? {
//             amount: depositedAmount,
//             bonus: depositBonus,
//             when: whenDepositHappened,
//           }
//         : null,
//     };

//     weeklyDetails.push(dayDetails);
//     runningCapital = dayDetails.finalBalance;
//   }

//   return weeklyDetails;
// };

// const generateWeeklyDetails = (
//   startingCapital = 0,
//   deposits = [],
//   lastWeekEndDate = null
// ) => {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   // If lastWeekEndDate is provided, move to the next Sunday
//   const startDate = lastWeekEndDate
//     ? new Date(new Date(lastWeekEndDate).getTime() + 7 * 24 * 60 * 60 * 1000)
//     : new Date();

//   // Get the date of the most recent Sunday for the new week
//   const sundayDate = new Date(startDate);
//   sundayDate.setDate(startDate.getDate() - startDate.getDay());

//   let runningCapital = startingCapital;
//   const weeklyDetails = [];

//   for (let i = 0; i < 7; i++) {
//     const date = new Date(sundayDate);
//     date.setDate(sundayDate.getDate() + i);

//     // Find deposits for this day
//     const dayDeposits = deposits.filter((deposit) => {
//       console.log(deposit);
//       const depositDate = new Date(deposit.date);
//       return (
//         depositDate.getDate() === date.getDate() &&
//         depositDate.getMonth() === date.getMonth() &&
//         depositDate.getFullYear() === date.getFullYear()
//       );
//     });

//     let depositInfo = null;
//     if (dayDeposits.length > 0) {
//       depositInfo = dayDeposits.map((deposit) => ({
//         amount: deposit.amount,
//         bonus: deposit.bonus,
//         when: deposit.whenDeposited,
//       }));
//     }

//     const dayProfits = calculateDayProfits(
//       runningCapital,
//       depositInfo,
//       depositInfo ? depositInfo[0].when : null // Using the first deposit's timing if multiple exist
//     );

//     const dayDetails = {
//       day: `${days[i]}, ${date.toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })}`,
//       date,
//       ...dayProfits,
//       deposits: depositInfo,
//     };

//     weeklyDetails.push(dayDetails);
//     runningCapital = dayDetails.finalBalance;
//   }

//   return weeklyDetails;
// };

// export const calculateDayProfits = (
//   initialBalance,
//   depositInfo = null,
//   whenDepositHappened = null
// ) => {
//   const firstTradeTotalAmount = initialBalance * 0.01;
//   const firstTradeRemainingBalance = initialBalance - firstTradeTotalAmount;
//   const firstTradeProfit = firstTradeTotalAmount * 0.88;
//   let capitalAfterFirstTrade =
//     firstTradeRemainingBalance + firstTradeTotalAmount + firstTradeProfit;

//   if (depositInfo && whenDepositHappened === "in-between") {
//     capitalAfterFirstTrade +=
//       depositInfo.depositedAmount + depositInfo.depositBonus;
//   }

//   const secondTradeTotalAmount = capitalAfterFirstTrade * 0.01;
//   const secondTradeRemainingBalance =
//     capitalAfterFirstTrade - secondTradeTotalAmount;
//   const secondTradeProfit = secondTradeTotalAmount * 0.88;
//   let finalBalance =
//     secondTradeRemainingBalance + secondTradeTotalAmount + secondTradeProfit;

//   if (depositInfo && whenDepositHappened === "completed") {
//     finalBalance += depositInfo.depositedAmount + depositInfo.depositBonus;
//   }

//   return {
//     startingCapital: initialBalance,
//     signal1Capital: firstTradeTotalAmount,
//     signal1Profit: firstTradeProfit,
//     signal2Capital: secondTradeTotalAmount,
//     signal2Profit: secondTradeProfit,
//     totalProfit: depositInfo
//       ? finalBalance - initialBalance - depositInfo.depositedAmount
//       : finalBalance - initialBalance,
//     finalBalance,
//   };
// };

// Utility Functions
export const calculateDayProfits = (
  initialBalance,
  depositInfo = null,
  whenDepositHappened = null
) => {
  const firstTradeTotalAmount = initialBalance * 0.01;
  const firstTradeRemainingBalance = initialBalance - firstTradeTotalAmount;
  const firstTradeProfit = firstTradeTotalAmount * 0.88;
  let capitalAfterFirstTrade =
    firstTradeRemainingBalance + firstTradeTotalAmount + firstTradeProfit;

  if (depositInfo && whenDepositHappened === "in-between") {
    capitalAfterFirstTrade +=
      depositInfo.depositedAmount + depositInfo.depositBonus;
  }

  const secondTradeTotalAmount = capitalAfterFirstTrade * 0.01;
  const secondTradeRemainingBalance =
    capitalAfterFirstTrade - secondTradeTotalAmount;
  const secondTradeProfit = secondTradeTotalAmount * 0.88;
  let finalBalance =
    secondTradeRemainingBalance + secondTradeTotalAmount + secondTradeProfit;

  if (depositInfo && whenDepositHappened === "completed") {
    finalBalance += depositInfo.depositedAmount + depositInfo.depositBonus;
  }

  return {
    startingCapital: initialBalance,
    signal1Capital: firstTradeTotalAmount,
    signal1Profit: firstTradeProfit,
    signal2Capital: secondTradeTotalAmount,
    signal2Profit: secondTradeProfit,
    totalProfit: depositInfo
      ? finalBalance - initialBalance - depositInfo.depositedAmount
      : finalBalance - initialBalance,
    finalBalance,
  };
};

const generateWeeklyDetails = (
  startingCapital = 0,
  depositedAmount = null,
  depositBonus = null,
  depositDate = null,
  whenDepositHappened = null,
  lastWeekEndDate = null
) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // If lastWeekEndDate is provided, move to the next Sunday
  const startDate = lastWeekEndDate
    ? new Date(new Date(lastWeekEndDate).getTime() + 7 * 24 * 60 * 60 * 1000)
    : new Date();

  // Get the date of the most recent Sunday for the new week
  const sundayDate = new Date(startDate);
  sundayDate.setDate(startDate.getDate() - startDate.getDay());

  const currentDay = new Date().getDay();

  let runningCapital = startingCapital;
  const weeklyDetails = [];

  const hasValidDeposit =
    depositedAmount && depositBonus && depositDate && whenDepositHappened;

  // console.log({
  //   depositBonus,
  //   depositDate,
  //   whenDepositHappened,
  //   depositedAmount,
  // });

  for (let i = 0; i < 7; i++) {
    const date = new Date(sundayDate);
    date.setDate(sundayDate.getDate() + i);

    let isDepositDay = false;
    let depositInfo = null;

    if (hasValidDeposit === 0) {
      try {
        const currentDate = date.toISOString().split("T")[0];
        const depositDateTime = new Date(depositDate);

        if (!isNaN(depositDateTime.getTime())) {
          isDepositDay =
            currentDate === depositDateTime.toISOString().split("T")[0];
          if (isDepositDay) {
            depositInfo = { depositedAmount, depositBonus };
          }
        }
      } catch (error) {
        console.warn("Invalid deposit date provided");
      }
    }

    const dayProfits = calculateDayProfits(
      runningCapital,
      depositInfo,
      isDepositDay ? whenDepositHappened : null
    );

    const dayDetails = {
      day: `${days[i]}, ${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
      date,
      ...dayProfits,
      depositInfo: isDepositDay
        ? {
            amount: depositedAmount,
            bonus: depositBonus,
            when: whenDepositHappened,
          }
        : null,
    };

    weeklyDetails.push(dayDetails);
    runningCapital = dayDetails.finalBalance;
  }

  return weeklyDetails;
};

export {
  calculateProfit,
  generateWeeklyDetails,
  // calculateDayProfits,
};
