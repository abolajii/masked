import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { DateTime } from "luxon";
import { Check, Clock, Hourglass } from "lucide-react";
import { getSignalForTheDay, updateRecentCapital } from "../api/request";

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #25262b;
    color: #fff;
  }
`;

const getStatusColor = (status) => {
  switch (status) {
    case "not-started":
      return "#9ca3af";
    case "in-progress":
      return "#facc15";
    case "completed":
      return "#10b981";
    default:
      return "#9ca3af";
  }
};

// Styled components remain the same...
const Container = styled.div``;
const LoadingContainer = styled.div`
  color: #f59f00;
  font-size: 0.9rem;
  font-weight: 500;
`;
const ErrorContainer = styled.div`
  color: #ef4444;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
`;
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;
const Card = styled.div`
  background: #25262b;

  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  border-left: 5px solid ${(props) => getStatusColor(props.status)};
  padding: 1rem;
`;
const CardHeader = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #f9fafb;
`;
const CardContent = styled.div`
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3px;
`;
const Time = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
`;
const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => getStatusColor(props.status)};
`;

const SignalWidget = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const response = await getSignalForTheDay();
      const formattedSignals = response.signals.map((signal) => {
        // Parse the datetime string properly
        const [datePart, startTime, , endTime] = signal.time.split(" ");
        return {
          ...signal,
          id: signal._id,
          time: `${startTime} - ${endTime}`,
          originalDate: datePart,
        };
      });
      setSignals(formattedSignals);
    } catch (err) {
      setError("Failed to fetch signals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch signals only once on mount
  useEffect(() => {
    fetchSignals();
  }, []);

  // Separate effect for status updates with proper dependencies
  useEffect(() => {
    const checkSignalStatus = () => {
      const now = DateTime.now();

      const updatedSignals = signals.map((signal) => {
        // Parse the time range
        const [startTimeStr, endTimeStr] = signal.time.split(" - ");

        // Create today's date with the signal times
        const today = now.toFormat("yyyy-MM-dd");
        const startTime = DateTime.fromFormat(
          `${today} ${startTimeStr}`,
          "yyyy-MM-dd HH:mm"
        );
        const endTime = DateTime.fromFormat(
          `${today} ${endTimeStr}`,
          "yyyy-MM-dd HH:mm"
        );

        let newStatus = signal.status;

        // Only update status if it's different from current
        if (
          now >= startTime &&
          now < endTime &&
          signal.status !== "in-progress"
        ) {
          newStatus = "in-progress";
        } else if (now >= endTime && signal.status !== "completed") {
          newStatus = "completed";
          // Only update capital if the signal isn't traded and status is changing to completed
          if (!signal.traded) {
            updateCapitalForSignal(signal);
          }
        }

        // Only return a new object if the status changed
        return newStatus !== signal.status
          ? { ...signal, status: newStatus }
          : signal;
      });

      // Only update state if there were actual changes
      if (JSON.stringify(updatedSignals) !== JSON.stringify(signals)) {
        setSignals(updatedSignals);
      }
    };

    const interval = setInterval(checkSignalStatus, 60000); // Check every minute
    checkSignalStatus(); // Initial check

    return () => clearInterval(interval);
  }, [signals]); // Include signals in dependencies

  const updateCapitalForSignal = async (signal) => {
    try {
      await updateRecentCapital();
      setSignals((prevSignals) =>
        prevSignals.map((s) =>
          s.id === signal.id ? { ...s, traded: true } : s
        )
      );
    } catch (err) {
      console.error("Failed to update capital:", err);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      "not-started": <Clock size={20} />,
      "in-progress": <Hourglass size={20} />,
      completed: <Check size={20} />,
    };
    return icons[status] || icons["not-started"];
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Hourglass size={24} className="animate-spin" color="#f59f00" />
        &nbsp; Loading signals...
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <WidgetGrid>
          {signals.map((signal) => (
            <Card key={signal.id} status={signal.status}>
              <CardHeader>{signal.title}</CardHeader>
              <CardContent>
                <Time>{signal.time}</Time>
                <StatusGroup status={signal.status}>
                  {getStatusIcon(signal.status)}
                  {signal.status.replace("-", " ")}
                </StatusGroup>
              </CardContent>
            </Card>
          ))}
        </WidgetGrid>
      </Container>
    </>
  );
};

export default SignalWidget;
