import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { calculateProfit } from "../utils";
import WithdrawalModal from "./WithdrawModal";

const Card = styled.div`
  background: ${(props) => props.theme.cardBg};
  border-radius: 0.5rem;
  box-shadow: ${(props) => props.theme.shadow};
  margin-bottom: 1rem;
  border: 1px solid ${(props) => props.theme.border};
  /* max-width: 400px; */
`;
const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const MonthlyCard = styled(Card)`
  margin-top: 1.5rem;
`;

const MonthSection = styled.div`
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${(props) => props.theme.cardBg};
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* margin-bottom: 0.3rem; */
`;

const MonthTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin: 0;
`;

const MonthSummary = styled.div`
  text-align: right;
`;

const SummaryText = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.secondaryText};
`;

const ProfitText = styled.div`
  font-weight: 600;
  color: #10b981;
`;

const TableContainer = styled.div`
  max-height: 20rem;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.375rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: ${(props) => props.align || "left"};
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableCell = styled.td`
  padding: 0.75rem;
  text-align: ${(props) => props.align || "left"};
  color: ${(props) => props.theme.text};
  border-top: 1px solid ${(props) => props.theme.border};
`;

const ProfitCell = styled(TableCell)`
  color: #10b981;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrencyToggle = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.inputBg};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const WithdrawButton = styled(CurrencyToggle)`
  background-color: ${(props) => props.theme.primary};
  color: white;

  &:hover {
    background-color: ${(props) => props.theme.primary}ee;
  }
`;

const WithdrawalTag = styled.span`
  background-color: #ef4444; /* Red background */
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  display: inline-flex;
  flex-direction: column;
`;

const MonthlyDetails = ({ initialCapital = 700000 }) => {
  const [currency, setCurrency] = useState("USD");
  const NGN_RATE = 1800; // Matching your existing conversion rate

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledWithdrawal, setScheduledWithdrawal] = useState(null);

  const calculateProfitUntilDate = (targetDate, signalPreference) => {
    let currentCapital = initialCapital;
    const targetDateTime = new Date(targetDate).getTime();
    const startDate = new Date("2025-02-19");

    while (startDate.getTime() <= targetDateTime) {
      const firstSignal = calculateProfit(currentCapital);
      currentCapital = firstSignal.balanceAfterTrade;

      if (signalPreference === "2" && startDate.getTime() < targetDateTime) {
        const secondSignal = calculateProfit(currentCapital);
        currentCapital = secondSignal.balanceAfterTrade;
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return currentCapital;
  };

  const generateMonthlyData = useMemo(() => {
    const months = [
      { name: "February", startDay: 19, endDay: 28, daysInMonth: 28 },
      { name: "March", startDay: 1, endDay: 31, daysInMonth: 31 },
      { name: "April", startDay: 1, endDay: 30, daysInMonth: 30 },
      { name: "May", startDay: 1, endDay: 31, daysInMonth: 31 },
      { name: "June", startDay: 1, endDay: 30, daysInMonth: 30 },
      { name: "July", startDay: 1, endDay: 31, daysInMonth: 31 },
      { name: "August", startDay: 1, endDay: 31, daysInMonth: 31 },
      { name: "September", startDay: 1, endDay: 30, daysInMonth: 30 },
      { name: "October", startDay: 1, endDay: 31, daysInMonth: 31 },
      { name: "November", startDay: 1, endDay: 30, daysInMonth: 30 },
      { name: "December", startDay: 1, endDay: 31, daysInMonth: 31 },
    ];

    let runningCapital = initialCapital;

    return months.map((month) => {
      const daysToCalculate =
        month.name === "February"
          ? month.endDay - month.startDay + 1
          : month.endDay - month.startDay + 1;

      const dailyProfits = [];
      let monthlyStartCapital = runningCapital;

      for (let day = 1; day <= daysToCalculate; day++) {
        const currentDate = new Date(`2025-${month.name}-${day}`);

        // First signal
        const firstSignal = calculateProfit(runningCapital);
        runningCapital = firstSignal.balanceAfterTrade;

        // Check for scheduled withdrawal after first signal
        if (
          scheduledWithdrawal &&
          currentDate.toISOString().split("T")[0] ===
            scheduledWithdrawal.date &&
          scheduledWithdrawal.signalPreference === 1
        ) {
          runningCapital -= scheduledWithdrawal.amount;
        }

        // Second signal
        const secondSignal = calculateProfit(runningCapital);
        runningCapital = secondSignal.balanceAfterTrade;

        // Check for scheduled withdrawal after second signal
        if (
          scheduledWithdrawal &&
          currentDate.toISOString().split("T")[0] ===
            scheduledWithdrawal.date &&
          scheduledWithdrawal.signalPreference === 2
        ) {
          runningCapital -= scheduledWithdrawal.amount;
        }

        const currentDateStr =
          month.name === "February" ? `${month.startDay + day - 1}` : `${day}`;

        dailyProfits.push({
          date: currentDateStr,
          startBalance: firstSignal.balanceBeforeTrade,
          endBalance: secondSignal.balanceAfterTrade,
          totalProfit:
            secondSignal.balanceAfterTrade - firstSignal.balanceBeforeTrade,
          hasWithdrawal:
            scheduledWithdrawal?.date ===
            currentDate.toISOString().split("T")[0],
        });
      }

      return {
        month: month.name,
        startBalance: monthlyStartCapital,
        endBalance: runningCapital,
        totalProfit: runningCapital - monthlyStartCapital,
        dailyDetails: dailyProfits,
      };
    });
  }, [initialCapital, scheduledWithdrawal]);

  const formatCurrency = (amount) => {
    const convertedAmount = currency === "USD" ? amount : amount * NGN_RATE;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(convertedAmount)
      .replace("USD", "$")
      .replace("NGN", "₦");
  };

  const handleWithdrawalConfirm = (withdrawalDetails) => {
    setScheduledWithdrawal(withdrawalDetails);
  };

  return (
    <MonthlyCard>
      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWithdrawalConfirm}
        currency={currency}
        calculateProfitUntilDate={calculateProfitUntilDate}
      />
      <CardHeader>
        <HeaderContainer>
          <CardTitle>Monthly Profit Details</CardTitle>
          <HeaderActions>
            <CurrencyToggle
              onClick={() =>
                setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"))
              }
            >
              Switch to {currency === "USD" ? "NGN" : "USD"}
            </CurrencyToggle>
            <WithdrawButton onClick={() => setIsModalOpen(true)}>
              Schedule Withdrawal
            </WithdrawButton>
          </HeaderActions>
        </HeaderContainer>
      </CardHeader>
      <CardContent>
        {generateMonthlyData.map((monthData, index) => (
          <MonthSection key={monthData.month}>
            <MonthHeader>
              <MonthTitle>{monthData.month}</MonthTitle>
              <MonthSummary>
                <SummaryText>
                  Start: {formatCurrency(monthData.startBalance)}
                </SummaryText>
                <SummaryText>
                  End: {formatCurrency(monthData.endBalance)}
                </SummaryText>
                <ProfitText>
                  Profit: {formatCurrency(monthData.totalProfit)}
                </ProfitText>
              </MonthSummary>
            </MonthHeader>

            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Date</TableHeader>
                    <TableHeader align="right">Start Balance</TableHeader>
                    <TableHeader align="right">End Balance</TableHeader>
                    <TableHeader align="right">Daily Profit</TableHeader>
                    <TableHeader align="right">Withdrawal</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {monthData.dailyDetails.map((day, dayIndex) => (
                    <tr key={dayIndex}>
                      <TableCell>
                        {monthData.month} {day.date}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(day.startBalance)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(day.endBalance)}
                      </TableCell>
                      <ProfitCell align="right">
                        {formatCurrency(day.totalProfit)}
                      </ProfitCell>
                      <TableCell align="right">
                        {day.hasWithdrawal && (
                          <WithdrawalTag>
                            <div>Withdrawn:</div>
                            {formatCurrency(scheduledWithdrawal.amount)}
                          </WithdrawalTag>
                        )}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </MonthSection>
        ))}
      </CardContent>
    </MonthlyCard>
  );
};

export default MonthlyDetails;
