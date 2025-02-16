import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Wallet,
  BarChart2,
  ArrowUpCircle,
  Calendar,
} from "lucide-react";
import { generateWeeklyDetails } from "../utils";
import useAuthStore from "../store/authStore";
import { getAllDeposits } from "../api/request";

const Container = styled.div`
  /* min-height: 100vh; */
  /* background-color: #1a1a1a; */
  /* padding: 0.5rem 1rem; */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: white;
  font-weight: bold;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #3d3d3d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
`;
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

const Widget = styled.div`
  background-color: #2d2d2d;
  padding: 1.25rem;
  border-radius: 1rem;

  ${(props) =>
    props.fullWidth &&
    `
    @media (min-width: 768px) {
      grid-column: 1 / -1;
    }
  `}
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const WidgetTitle = styled.h3`
  color: #a0a0a0;
  margin: 0;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const WidgetValue = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.color || "white"};
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DailyReportGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DailyReport = styled.div`
  background-color: #2d2d2d;
  padding: 1.25rem;
  border-radius: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;
const DailyReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DayTitle = styled.h3`
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ProfitValue = styled.div`
  color: #4ade80;
  font-weight: bold;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;
const DetailSection = styled.div`
  color: white;
`;

const DetailLabel = styled.p`
  color: #a0a0a0;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.p`
  font-weight: bold;
  margin: 0;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const SignalDetails = styled.div`
  display: flex;
  gap: 1rem;
`;

const DepositInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
`;

const isToday = (dateString) => {
  const today = new Date();
  const checkDate = new Date(dateString);
  return today.toDateString() === checkDate.toDateString();
};

const Weekly = () => {
  const { user } = useAuthStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [startingCapital, setStartingCapital] = useState(user.weekly_capital);
  const [weeklyDetailsHistory, setWeeklyDetailsHistory] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const NAIRA_RATE = 1700;

  const [deposits, setDeposits] = useState([]);

  const fetchDeposits = async () => {
    const response = await getAllDeposits();
    // console.log(response);
    setDeposits(response.deposits);
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // console.log(deposits);

  const convertCurrency = (amount) => {
    const formattedAmount = amount?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return currency === "NGN"
      ? (amount * NAIRA_RATE).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : formattedAmount;
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"));
  };
  useEffect(() => {
    const initialWeekDetails = generateWeeklyDetails(
      startingCapital
      // 8.1089,
      // 0,
      // "2025-02-16",
      // "completed"
    );
    setWeeklyDetailsHistory([initialWeekDetails]);
  }, []);

  const navigateWeek = (direction) => {
    const newOffset =
      direction === "next" ? weekOffset + 1 : Math.max(0, weekOffset - 1);

    if (weeklyDetailsHistory[newOffset]) {
      setWeekOffset(newOffset);
      return;
    }

    const previousWeekFinalDate = weeklyDetailsHistory[newOffset - 1][6].day;
    const previousWeekFinalBalance =
      weeklyDetailsHistory[newOffset - 1][6].finalBalance;

    const newWeekDetails = generateWeeklyDetails(
      previousWeekFinalBalance,
      null,
      null,
      null,
      null,
      previousWeekFinalDate
    );

    setWeeklyDetailsHistory((prev) => {
      const updatedHistory = [...prev];
      updatedHistory[newOffset] = newWeekDetails;
      return updatedHistory;
    });
    setWeekOffset(newOffset);
  };

  const weekDetails = weeklyDetailsHistory[weekOffset] || [];

  const formatWeekDateRange = (weekDetails) => {
    if (!weekDetails || weekDetails.length === 0) return "";

    const firstDay = new Date(weekDetails[0].day);
    const lastDay = new Date(weekDetails[6].day);

    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return `${firstDay.toLocaleDateString(
      "en-US",
      options
    )} - ${lastDay.toLocaleDateString("en-US", options)}`;
  };

  const totalSignal1Profit = weekDetails.reduce(
    (sum, day) => sum + day.signal1Profit,
    0
  );
  const totalSignal2Profit = weekDetails.reduce(
    (sum, day) => sum + day.signal2Profit,
    0
  );

  const totalProfit = totalSignal1Profit + totalSignal2Profit;

  const weeklySummary =
    weekDetails.length > 0
      ? {
          runningCapital: weekDetails[0].startingCapital,
          startingCapital: weekDetails[0].startingCapital,
          totalWeeklyProfit: weekDetails.reduce(
            (sum, day) => sum + day.totalProfit,
            0
          ),
          totalSignal1Profit: weekDetails.reduce(
            (sum, day) => sum + day.signal1Profit,
            0
          ),
          totalSignal2Profit: weekDetails.reduce(
            (sum, day) => sum + day.signal2Profit,
            0
          ),
          finalBalance: weekDetails[6]?.finalBalance || 0,
        }
      : null;

  if (!weeklySummary) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Weekly Signals</Title>
        <ButtonGroup>
          <Button
            onClick={() => navigateWeek("prev")}
            disabled={weekOffset === 0}
          >
            <ArrowLeft size={20} /> Previous Week
          </Button>
          <Button onClick={() => navigateWeek("next")}>
            Next Week <ArrowRight size={20} />
          </Button>
        </ButtonGroup>
        <Button onClick={toggleCurrency}>
          Switch to {currency === "USD" ? "₦" : "$"}
        </Button>
      </Header>
      <WidgetGrid>
        <Widget>
          <WidgetHeader>
            <Calendar color="#a78bfa" />
            <WidgetTitle>
              {weekOffset === 0 ? "Current " : weekOffset + " "}
              Week Days
            </WidgetTitle>
          </WidgetHeader>
          <DetailValue color="#a78bfa">
            {formatWeekDateRange(weekDetails)}
          </DetailValue>
        </Widget>
      </WidgetGrid>

      <WidgetGrid>
        <Widget>
          <WidgetHeader>
            <Wallet color="#60a5fa" />
            <WidgetTitle>Starting Capital</WidgetTitle>
          </WidgetHeader>
          <WidgetValue>
            {currency === "USD" ? "$" : "₦"}
            {convertCurrency(weeklySummary.startingCapital)}
          </WidgetValue>
        </Widget>

        <Widget>
          <WidgetHeader>
            <TrendingUp color="#4ade80" />
            <WidgetTitle>Weekly Profit</WidgetTitle>
          </WidgetHeader>
          <WidgetValue color="#4ade80">
            {currency === "USD" ? "$" : "₦"}
            {convertCurrency(totalProfit)}
          </WidgetValue>
        </Widget>

        <Widget>
          <WidgetHeader>
            <ArrowUpCircle color="#a78bfa" />
            <WidgetTitle>Signal 1 Profits</WidgetTitle>
          </WidgetHeader>
          <WidgetValue color="#a78bfa">
            {currency === "USD" ? "$" : "₦"}
            {convertCurrency(weeklySummary.totalSignal1Profit)}
          </WidgetValue>
        </Widget>

        <Widget>
          <WidgetHeader>
            <ArrowUpCircle color="#818cf8" />
            <WidgetTitle>Signal 2 Profits</WidgetTitle>
          </WidgetHeader>
          <WidgetValue color="#818cf8">
            {currency === "USD" ? "$" : "₦"}
            {convertCurrency(weeklySummary.totalSignal2Profit)}
          </WidgetValue>
        </Widget>

        <Widget>
          <WidgetHeader>
            <BarChart2 color="#fbbf24" />
            <WidgetTitle>Final Balance</WidgetTitle>
          </WidgetHeader>
          <WidgetValue color="#fbbf24">
            {currency === "USD" ? "$" : "₦"}
            {convertCurrency(weeklySummary.finalBalance)}
          </WidgetValue>
        </Widget>
      </WidgetGrid>

      <DailyReportGrid>
        {weekDetails.map((day, index) => (
          <DailyReport key={day.day}>
            <DailyReportHeader>
              <DayTitle>
                {day.day}
                {isToday(day.day) && (
                  <span style={{ marginLeft: "0.5rem", color: "#4ade80" }}>
                    Today
                  </span>
                )}
              </DayTitle>
              <ProfitValue>
                {currency === "USD" ? "$" : "₦"}
                {convertCurrency(day.totalProfit)}
              </ProfitValue>
            </DailyReportHeader>

            <DetailGrid>
              <DetailSection>
                <DetailLabel>Starting Capital</DetailLabel>
                <DetailValue>
                  {currency === "USD" ? "$" : "₦"}
                  {convertCurrency(day.startingCapital)}
                </DetailValue>
              </DetailSection>

              <DetailSection>
                <DetailLabel>Signal 1</DetailLabel>
                <SignalDetails>
                  <div>
                    <DetailLabel>Capital</DetailLabel>
                    <DetailValue>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.signal1Capital)}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Profit</DetailLabel>
                    <DetailValue style={{ color: "#4ade80" }}>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.signal1Profit)}
                    </DetailValue>
                  </div>
                </SignalDetails>
              </DetailSection>

              <DetailSection>
                <DetailLabel>Signal 2</DetailLabel>
                <SignalDetails>
                  <div>
                    <DetailLabel>Capital</DetailLabel>
                    <DetailValue>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.signal2Capital)}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Profit</DetailLabel>
                    <DetailValue style={{ color: "#4ade80" }}>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.signal2Profit)}
                    </DetailValue>
                  </div>
                </SignalDetails>
              </DetailSection>
            </DetailGrid>

            {day.depositInfo && (
              <DepositInfo>
                <DetailLabel style={{ color: "#60a5fa", fontWeight: "bold" }}>
                  Deposit Information
                </DetailLabel>
                <DetailGrid>
                  <div>
                    <DetailLabel>Amount</DetailLabel>
                    <DetailValue>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.depositInfo.amount)}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Bonus</DetailLabel>
                    <DetailValue style={{ color: "#4ade80" }}>
                      {currency === "USD" ? "$" : "₦"}
                      {convertCurrency(day.depositInfo.bonus)}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>When</DetailLabel>
                    <DetailValue>{day.depositInfo.when}</DetailValue>
                  </div>
                </DetailGrid>
              </DepositInfo>
            )}
          </DailyReport>
        ))}
      </DailyReportGrid>
    </Container>
  );
};

export default Weekly;
