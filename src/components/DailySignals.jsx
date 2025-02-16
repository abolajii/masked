import React, { useState } from "react";
import styled from "styled-components";
import useAuthStore from "../store/authStore";

const Container = styled.div`
  background: #1a1b1e;
  border-radius: 12px;
  color: #ffffff;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
  height: 300px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #25262b;
  color: #a0a0a0;
  font-weight: 500;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #2c2d30;
  color: #ffffff;
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ProfitText = styled.span`
  color: ${(props) => (props.value >= 0 ? "#4caf50" : "#f44336")};
`;

const StatusText = styled.span`
  color: ${(props) => {
    switch (props.status) {
      case "completed":
        return "#4caf50";
      case "in-progress":
        return "#ffd700";
      case "pending":
        return "#a0a0a0";
      default:
        return "#ffffff";
    }
  }};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const calculateDayProfits = (initialBalance) => {
  const firstTradeTotalAmount = initialBalance * 0.01;
  const firstTradeRemainingBalance = initialBalance - firstTradeTotalAmount;
  const firstTradeProfit = firstTradeTotalAmount * 0.88;
  const capitalAfterFirstTrade =
    firstTradeRemainingBalance + firstTradeTotalAmount + firstTradeProfit;

  const secondTradeTotalAmount = capitalAfterFirstTrade * 0.01;
  const secondTradeRemainingBalance =
    capitalAfterFirstTrade - secondTradeTotalAmount;
  const secondTradeProfit = secondTradeTotalAmount * 0.88;
  const finalBalance =
    secondTradeRemainingBalance + secondTradeTotalAmount + secondTradeProfit;

  return {
    signal1Capital: firstTradeTotalAmount,
    signal1Profit: firstTradeProfit,
    signal2Capital: secondTradeTotalAmount,
    signal2Profit: secondTradeProfit,
    totalProfit: finalBalance - initialBalance,
    finalBalance,
  };
};

const generateWeeklyData = (
  weeklyCapital,
  signalsStatus,
  lastDayDate = null
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

  const startDate = lastDayDate
    ? new Date(new Date(lastDayDate).getTime() + 24 * 60 * 60 * 1000)
    : new Date();

  const currentDay = new Date().getDay();

  const sundayDate = new Date(startDate);
  sundayDate.setDate(startDate.getDate() - currentDay);

  let runningCapital = weeklyCapital;
  let weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(sundayDate);
    date.setDate(sundayDate.getDate() + i);

    const dayProfits = calculateDayProfits(runningCapital);

    let status;
    if (i < currentDay) {
      status = "completed";
    } else if (i === currentDay) {
      status = signalsStatus;
    } else {
      status = "pending";
    }

    const dayData = {
      day: date.toLocaleDateString("en-US", {
        // month: "short",
        // day: "numeric",
        // year: "numeric",

        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      startingCapital: runningCapital,
      signal1Capital: dayProfits.signal1Capital,
      signal1Profit: dayProfits.signal1Profit,
      signal2Capital: dayProfits.signal2Capital,
      signal2Profit: dayProfits.signal2Profit,
      totalProfit: dayProfits.totalProfit,
      finalCapital: dayProfits.finalBalance,
      status: status,
      date,
      differenceInProfit: dayProfits.signal2Profit - dayProfits.signal1Profit,
    };

    weeklyData.push(dayData);
    runningCapital = dayProfits.finalBalance;
  }

  return weeklyData;
};

const CurrencyToggle = styled.button`
  background: ${(props) => (props.active ? "#4c6ef5" : "#2c2d30")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => (props.active ? "#4c6ef5" : "#3c3d40")};
  }
`;

const ToggleContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const formatCurrency = (amount, currency = "USD") => {
  const NAIRA_RATE = 1656;

  if (currency === "NGN") {
    amount = amount * NAIRA_RATE;
    return `₦${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
};

const DailySignals = () => {
  const { user } = useAuthStore();
  const signalsData = generateWeeklyData(
    user.weekly_capital,
    "awaiting outcome"
  );

  const [currency, setCurrency] = useState("USD");

  const handleCurrencyToggle = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const formatCurrency = (amount, currency = "USD") => {
    const NAIRA_RATE = 1656;

    if (currency === "NGN") {
      amount = amount * NAIRA_RATE;
    }

    // Format number with commas and 2 decimal places
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return currency === "NGN" ? `₦${formattedNumber}` : `$${formattedNumber}`;
  };

  return (
    <Container>
      <Header>
        <Title>Daily Trading Signals</Title>

        <ToggleContainer>
          <CurrencyToggle
            active={currency === "USD"}
            onClick={() => handleCurrencyToggle("USD")}
          >
            USD
          </CurrencyToggle>
          <CurrencyToggle
            active={currency === "NGN"}
            onClick={() => handleCurrencyToggle("NGN")}
          >
            NGN
          </CurrencyToggle>
        </ToggleContainer>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Signal 1 Capital</Th>
              <Th>Signal 1 Profit</Th>
              <Th>Signal 2 Capital</Th>
              <Th>Signal 2 Profit</Th>
              <Th>Total Profit</Th>
              <Th>Difference</Th>
              <Th>Final Balance</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {signalsData.map((signal) => (
              <TableRow key={signal.day}>
                <Td>{signal.day}</Td>
                <Td>{formatCurrency(signal.signal1Capital, currency)}</Td>
                <Td>
                  <ProfitText value={signal.signal1Profit}>
                    {formatCurrency(signal.signal1Profit, currency)}
                  </ProfitText>
                </Td>
                <Td>{formatCurrency(signal.signal2Capital, currency)}</Td>
                <Td>
                  <ProfitText value={signal.signal2Profit}>
                    {formatCurrency(signal.signal2Profit, currency)}
                  </ProfitText>
                </Td>
                <Td>
                  <ProfitText value={signal.totalProfit}>
                    {formatCurrency(signal.totalProfit, currency)}
                  </ProfitText>
                </Td>
                <Td>
                  <ProfitText value={signal.differenceInProfit}>
                    {formatCurrency(signal.differenceInProfit, currency)}
                  </ProfitText>
                </Td>

                <Td>{formatCurrency(signal.finalCapital, currency)}</Td>
                <Td>
                  <StatusText status={signal.status}>
                    {signal.status}
                  </StatusText>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default DailySignals;
