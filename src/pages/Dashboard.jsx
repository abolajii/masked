import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import SignalWidget from "../components/Signal";
import styled from "styled-components";
import { DollarSign, Eye, EyeOff, TrendingUp, Wallet } from "lucide-react";
import DailySignals from "../components/DailySignals";

const WelcomeHeader = styled.h2`
  display: flex;
  gap: 7px;
  align-items: center;
  color: #ffffff;
  margin-bottom: 1.5rem;

  @media (max-width: 767px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  margin-top: 1.5rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const StatCard = styled.div`
  background: #25262b;
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

const StatIcon = styled.div`
  background: ${(props) => props.color};
  padding: 0.875rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  color: #a0a0a0;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.375rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
`;

const VisibilityButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(245, 159, 0, 0.1);
  }
`;

const formatValue = (value, currency, nairaRate = 1700) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const amount = currency === "NGN" ? value * nairaRate : value;
  const formattedAmount = amount.toLocaleString("en-US", options);
  return `${currency === "NGN" ? "₦" : "$"}${formattedAmount}`;
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [isHidden, setIsHidden] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const toggleVisibility = () => setIsHidden(!isHidden);

  const hideValue = (value) => {
    return isHidden ? "••••••" : value;
  };

  return (
    <div>
      <WelcomeHeader>
        Welcome, {user.username}
        <VisibilityButton onClick={toggleVisibility}>
          {isHidden ? (
            <EyeOff size={20} color="#f59f00" />
          ) : (
            <Eye size={20} color="#f59f00" />
          )}
        </VisibilityButton>
      </WelcomeHeader>
      <SignalWidget />

      <StatsGrid>
        <StatCard>
          <StatIcon color="#4c6ef5">
            <Wallet size={22} color="#ffffff" />
          </StatIcon>
          <StatInfo>
            <StatLabel>Current Balance</StatLabel>
            <StatValue>
              {hideValue(formatValue(user.running_capital, currency))}
            </StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#4caf50">
            <DollarSign size={22} color="#ffffff" />
          </StatIcon>
          <StatInfo>
            <StatLabel>Total Profit</StatLabel>
            <StatValue>
              {hideValue(formatValue(user.total_profit || 0, currency))}
            </StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59f00">
            <TrendingUp size={22} color="#ffffff" />
          </StatIcon>
          <StatInfo>
            <StatLabel>Average Profit</StatLabel>
            <StatValue>
              {hideValue(formatValue(user.average_profit || 0, currency))}
            </StatValue>
          </StatInfo>
        </StatCard>
      </StatsGrid>
      <DailySignals />
    </div>
  );
};

export default Dashboard;
