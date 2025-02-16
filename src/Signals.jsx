import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { calculateProfit } from "./utils";

const Container = styled.div`
  padding: 1rem;
  background-color: #111827;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #f3f4f6;
`;

const SignalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  background-color: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SignalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SignalName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f3f4f6;
`;

const SignalTime = styled.p`
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const Badge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ variant }) => {
    switch (variant) {
      case "not-started":
        return `
          background-color: #374151;
          color: #f3f4f6;
        `;
      case "in-progress":
        return `
          background-color: #92400e;
          color: #fef3c7;
        `;
      case "completed":
        return `
          background-color: #065f46;
          color: #d1fae5;
        `;
      case "traded":
        return `
          background-color: transparent;
          border: 1px solid #4b5563;
          color: #d1d5db;
        `;
      default:
        return "";
    }
  }}
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Signals = () => {
  const [recentCapital, setRecentCapital] = useState(2218.3);
  const [signals, setSignals] = useState([
    {
      id: 1,
      name: "Signal 1",
      time: "14:00 - 14:30",
      traded: false,
      status: "not-started",
    },
    {
      id: 2,
      name: "Signal 2",
      time: "19:00 - 19:30",
      traded: false,
      status: "not-started",
    },
  ]);

  useEffect(() => {
    const checkSignalStatus = () => {
      const currentTime = new Date();
      const updatedSignals = signals.map((signal) => {
        const [startTime, endTime] = signal.time.split(" - ");
        const [startHour, startMin] = startTime.split(":");
        const [endHour, endMin] = endTime.split(":");

        const signalStart = new Date();
        signalStart.setHours(parseInt(startHour), parseInt(startMin), 0);

        const signalEnd = new Date();
        signalEnd.setHours(parseInt(endHour), parseInt(endMin), 0);

        let newStatus = signal.status;
        if (currentTime >= signalStart && currentTime <= signalEnd) {
          newStatus = "in-progress";
        } else if (currentTime > signalEnd && !signal.traded) {
          newStatus = "completed";
          // Here you would typically make an API call to update the traded status
          updateTradeStatus(signal.id);
        }

        return {
          ...signal,
          status: newStatus,
        };
      });

      setSignals(updatedSignals);
    };

    const interval = setInterval(checkSignalStatus, 60000); // Check every minute
    checkSignalStatus(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const updateTradeStatus = (id) => {
    console.log("Updating current price");
    // calulate profit with the recentCapital
    const result = calculateProfit(recentCapital);
    console.log(result.balanceAfterTrade);
    setRecentCapital(result.balanceAfterTrade);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "not-started":
        return (
          <Badge variant="not-started">
            <StyledIcon>
              <Clock size={16} />
            </StyledIcon>
            Not Started
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="in-progress">
            <StyledIcon>
              <AlertCircle size={16} />
            </StyledIcon>
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="completed">
            <StyledIcon>
              <CheckCircle size={16} />
            </StyledIcon>
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>Trading Signals</Title>
      <SignalList>
        {signals.map((signal) => (
          <Card key={signal.id}>
            <CardContent>
              <SignalInfo>
                <SignalName>{signal.name}</SignalName>
                <SignalTime>
                  <StyledIcon>
                    <Clock size={16} />
                  </StyledIcon>
                  {signal.time}
                </SignalTime>
              </SignalInfo>
              <StatusContainer>
                {getStatusBadge(signal.status)}
                {signal.traded && (
                  <Badge variant="traded">
                    <StyledIcon>
                      <CheckCircle size={16} />
                    </StyledIcon>
                    Traded
                  </Badge>
                )}
              </StatusContainer>
            </CardContent>
          </Card>
        ))}
      </SignalList>

      {recentCapital}
    </Container>
  );
};

export default Signals;
