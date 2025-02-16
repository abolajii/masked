import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Check, Clock, Hourglass, Sun, Moon } from "lucide-react";

const themes = {
  light: {
    background: "#f8f9fa",
    cardBackground: "#ffffff",
    text: "#1a1a1a",
    subtext: "#4b5563",
    statuses: {
      "not-started": {
        background: "#f3f4f6",
        color: "#4b5563",
      },
      "in-progress": {
        background: "#dbeafe",
        color: "#2563eb",
      },
      completed: {
        background: "#dcfce7",
        color: "#16a34a",
      },
    },
  },
  dark: {
    background: "#1a1a1a",
    cardBackground: "#2d2d2d",
    text: "#ffffff",
    subtext: "#a1a1aa",
    statuses: {
      "not-started": {
        background: "#374151",
        color: "#9ca3af",
      },
      "in-progress": {
        background: "#1e3a8a",
        color: "#60a5fa",
      },
      completed: {
        background: "#064e3b",
        color: "#34d399",
      },
    },
  },
};

const AppContainer = styled.div`
  /* background-color: ${(props) => props.theme.background}; */
  transition: all 0.3s ease;
  margin: 10px 0;
`;

const WidgetContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 0 auto;
`;

const Card = styled.div`
  padding: 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background-color: ${(props) => props.theme.statuses[props.status].background};
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.text};
`;

const Time = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.subtext};
  margin: 0;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  text-transform: capitalize;
  color: ${(props) => props.theme.statuses[props.status].color};
  font-weight: 500;
`;

const IconWrapper = styled.div`
  color: ${(props) => props.theme.statuses[props.status].color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.75rem;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.text};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SignalWidget = ({ onUpdateCapital }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [signals, setSignals] = useState([
    {
      title: "Signal 1",
      time: "14:00 - 14:30",
      status: "not-started",
      startHour: 14,
      endHour: 14,
      endMinute: 30,
      traded: false,
      capitalUpdated: false, // New flag to track if capital was updated early
    },
    {
      title: "Signal 2",
      time: "19:00 - 19:30",
      status: "not-started",
      startHour: 19,
      endHour: 19,
      endMinute: 30,
      traded: false,
      capitalUpdated: false,
    },
  ]);

  const getSignalForTheDay = async () => {};

  const updateSignalStatus = async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  };

  React.useEffect(() => {
    getSignalForTheDay();
  }, []);

  useEffect(() => {
    updateSignalStatus();
    // Check every minute
    const interval = setInterval(updateSignalStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "not-started":
        return <Clock size={20} />;
      case "in-progress":
        return <Hourglass size={20} />;
      case "completed":
        return <Check size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? themes.dark : themes.light}>
      <AppContainer>
        <ThemeToggle onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeToggle>
        <WidgetContainer>
          {signals.map((signal, index) => (
            <Card key={index} status={signal.status}>
              <CardContent>
                <TextContainer>
                  <Title>{signal.title}</Title>
                  <Time>{signal.time}</Time>
                </TextContainer>
                <StatusContainer>
                  <StatusText status={signal.status}>
                    {signal.status.replace("-", " ")}
                  </StatusText>
                  <IconWrapper status={signal.status}>
                    {getStatusIcon(signal.status)}
                  </IconWrapper>
                </StatusContainer>
              </CardContent>
            </Card>
          ))}
        </WidgetContainer>
      </AppContainer>
    </ThemeProvider>
  );
};

export default SignalWidget;
