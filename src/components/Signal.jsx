import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { DateTime } from "luxon";
import { Check, Clock, Hourglass } from "lucide-react";
import { getSignalForTheDay, updateRecentCapital } from "../api/request";

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1a1a2e;
    color: #fff;
  }
`;

const getStatusColor = (status) => {
  switch (status) {
    case "not-started":
      return "#9ca3af"; // Gray
    case "in-progress":
      return "#facc15"; // Yellow
    case "completed":
      return "#10b981"; // Green
    default:
      return "#9ca3af";
  }
};

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
  background: #222240;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  border-left: 5px solid ${(props) => getStatusColor(props.status)};
  padding: 1rem;
`;

const CardHeader = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f9fafb;
`;

const CardContent = styled.div`
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-weight: 500;
  color: ${(props) => getStatusColor(props.status)};
`;

const defaultSignals = [
  {
    id: 1,
    title: "Signal 1",
    time: "14:00 - 14:30",
    traded: false,
    status: "not-started",
    capitalUpdated: false,
  },
  {
    id: 2,
    title: "Signal 2",
    time: "19:00 - 19:30",
    traded: false,
    status: "not-started",
    capitalUpdated: false,
  },
];

const SignalWidget = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSignals();
    // const intervalId = setInterval(updateSignalStatuses, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const response = await getSignalForTheDay();
      const fetchedSignal = response.signals.map((signal) => {
        const defaultSignal = defaultSignals.find(
          (ds) => ds.title === signal.title
        );
        return {
          id: signal._id,
          title: signal.title,
          traded: signal.traded,
          status: signal.status,
          capitalUpdated: false,
          time: defaultSignal ? defaultSignal.time : signal.time,
        };
      });
      setSignals(fetchedSignal);
    } catch (err) {
      setError("Failed to fetch signals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        } else if (currentTime >= signalEnd) {
          newStatus = "completed";
          console.log(signal);

          // Here you would typically make an API call to update the traded status
          updateCapitalForSignal(signal);
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

  const updateCapitalForSignal = async (signal) => {
    try {
      if (!signal.traded && signal.status !== "completed")
        await updateRecentCapital();
      setSignals((prevSignals) =>
        prevSignals.map((s) =>
          s.id === signal.id ? { ...s, capitalUpdated: true } : s
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
          {signals.map((signal) => {
            return (
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
            );
          })}
        </WidgetGrid>
      </Container>
    </>
  );
};

export default SignalWidget;
