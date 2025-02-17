import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #1a1a1a;
  color: #ffffff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: #e0e0e0;
  font-size: 0.9rem;
  font-weight: 500;
`;

// Calendar specific styled components
const CalendarContainer = styled.div`
  background-color: #3d3d3d;
  border-radius: 8px;
  padding: 1rem;
  max-width: 400px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthYear = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  margin: 0;
`;

const CalendarButton = styled.button`
  background-color: #4d4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5d5d5d;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const WeekDay = styled.div`
  color: #999;
  text-align: center;
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const Day = styled.button`
  background-color: ${(props) =>
    props.selected ? "#ff9800" : props.isToday ? "#c52424" : "transparent"};
  color: ${(props) =>
    props.selected ? "white" : props.isCurrentMonth ? "white" : "#666"};
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#ff9800" : "#5d5d5d")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #ff9800;
  border-radius: 50%;
  background-color: #3d3d3d;
  cursor: pointer;

  &:checked {
    background-color: #ff9800;
    border: 2px solid #ff9800;
    box-shadow: inset 0 0 0 3px #3d3d3d;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #ff9800;
  border-radius: 4px;
  background-color: #3d3d3d;
  cursor: pointer;

  &:checked {
    background-color: #ff9800;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='24px' height='24px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
    background-size: 80%;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const A = styled.div`
  flex: 1;
`;

const B = styled.div`
  flex: 1;
  display: flex;
`;

// Calendar Component
const Calendar = ({
  selectedDate,
  onDateSelect,
  multiSelect = false,
  selectedDates = [],
  onMultiDateSelect = () => {},
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (multiSelect) {
      const dateStr = date.toISOString().split("T")[0];
      if (selectedDates.includes(dateStr)) {
        onMultiDateSelect(selectedDates.filter((d) => d !== dateStr));
      } else {
        onMultiDateSelect([...selectedDates, dateStr]);
      }
    } else {
      onDateSelect(date);
    }
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarButton onClick={prevMonth}>&lt;</CalendarButton>
        <MonthYear>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </MonthYear>
        <CalendarButton onClick={nextMonth}>&gt;</CalendarButton>
      </CalendarHeader>
      <DaysGrid>
        {weekDays.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
        {days.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().split("T")[0];
          const isSelected = multiSelect
            ? selectedDates.includes(dateStr)
            : selectedDate?.toISOString().split("T")[0] === dateStr;

          return (
            <Day
              key={index}
              selected={isSelected}
              isCurrentMonth={isCurrentMonth}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
            </Day>
          );
        })}
      </DaysGrid>
    </CalendarContainer>
  );
};
const SelectedDates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #3d3d3d;
  border-radius: 8px;
  min-width: 200px;
  max-height: 350px;
  overflow-y: auto;
`;

const SelectedDate = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0 0.25rem;
    font-size: 1.2rem;

    &:hover {
      color: #ff1744;
    }
  }
`;

const Button = styled.button`
  background-color: #ff9800;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f57c00;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #ef6c00;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #757575;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LeaveDatesContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const LeaveDatesHeader = styled.h4`
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

const NoLeaveDates = styled.p`
  color: #999;
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
`;

// Previous styled components and Calendar component remain the same...

const SetupTrade = () => {
  const [birthDate, setBirthDate] = useState(null);
  const [resignationDate, setResignationDate] = useState(null);
  const [workType, setWorkType] = useState("office");
  const [remoteDays, setRemoteDays] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);

  const weekDays = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
  ];

  const handleRemoteDayToggle = (day) => {
    setRemoteDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      birthDate,
      resignationDate,
      workType,
      remoteDays: workType === "hybrid" ? remoteDays : [],
      leaveDates,
    };
    console.log("Form submitted:", formData);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Card>
          <Title>Setup Configuration</Title>
          <Flex>
            <A>
              <FormGroup>
                <Label>Work Type</Label>
                <RadioGroup>
                  {["office", "remote", "hybrid"].map((type) => (
                    <RadioOption key={type}>
                      <RadioInput
                        type="radio"
                        id={type}
                        name="workType"
                        value={type}
                        checked={workType === type}
                        onChange={(e) => setWorkType(e.target.value)}
                      />
                      <Label htmlFor={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                        {type === "office" && " (Mon-Fri)"}
                      </Label>
                    </RadioOption>
                  ))}
                </RadioGroup>
              </FormGroup>

              {workType === "hybrid" && (
                <FormGroup>
                  <Label>Select Remote Work Days</Label>
                  <CheckboxGroup>
                    {weekDays.map((day) => (
                      <CheckboxOption key={day.id}>
                        <Checkbox
                          type="checkbox"
                          id={day.id}
                          checked={remoteDays.includes(day.id)}
                          onChange={() => handleRemoteDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </CheckboxOption>
                    ))}
                  </CheckboxGroup>
                </FormGroup>
              )}
            </A>
            <B>
              <FormGroup>
                <Label>Birth Date</Label>
                <Calendar
                  selectedDate={birthDate}
                  onDateSelect={setBirthDate}
                />
              </FormGroup>
            </B>
          </Flex>
          <Flex>
            <A>
              <FormGroup>
                <Label>Resignation Date</Label>
                <Calendar
                  selectedDate={resignationDate}
                  onDateSelect={setResignationDate}
                />
              </FormGroup>
            </A>
            <B>
              <FormGroup>
                <Label>Leave Days</Label>
                <LeaveDatesContainer>
                  <Calendar
                    multiSelect
                    selectedDates={leaveDates}
                    onMultiDateSelect={setLeaveDates}
                  />
                  <SelectedDates>
                    {/* <LeaveDatesHeader>Selected Leave Dates</LeaveDatesHeader> */}
                    {leaveDates.length > 0 ? (
                      leaveDates.map((date) => (
                        <SelectedDate key={date}>
                          {new Date(date).toLocaleDateString()}
                          <button
                            onClick={() =>
                              setLeaveDates(
                                leaveDates.filter((d) => d !== date)
                              )
                            }
                            type="button"
                          >
                            ×
                          </button>
                        </SelectedDate>
                      ))
                    ) : (
                      <NoLeaveDates>Select leave days</NoLeaveDates>
                    )}
                  </SelectedDates>
                </LeaveDatesContainer>
              </FormGroup>
            </B>
          </Flex>

          <Button type="submit">Save Configuration</Button>
        </Card>
      </Form>
    </Container>
  );
};

export default SetupTrade;
