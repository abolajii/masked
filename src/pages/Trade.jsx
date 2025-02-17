import {
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const CurrencySection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CapitalDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #2d2d2d;
  border-radius: 8px;
  min-width: 250px;
`;

const CapitalIcon = styled.div`
  color: #4dc5b9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CapitalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CapitalLabel = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const CapitalValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
`;

const CurrencyIcon = styled.div`
  color: #4dc5b9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ff9800;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e18905;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const ButtonText = styled.span`
  margin-left: 0.25rem;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #9ca3af;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #374151;
  border-radius: 4px;
  font-size: 1rem;
  background: #2d2d2d;
  color: #fff;
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
`;

const DateRangeDisplay = styled(CapitalDisplay)`
  min-width: 300px;
  background: #2d2d2d;
`;

const DateIcon = styled(CapitalIcon)`
  color: #4dc5b9;
`;

const DateInfo = styled(CapitalInfo)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateLabel = styled(CapitalLabel)`
  color: #9ca3af;
`;

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 0.875rem;
`;

const DateDivider = styled.span`
  color: #4dc5b9;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StyledToggleContainer = styled(ToggleContainer)`
  background: #2d2d2d;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleLabel = styled.label`
  font-size: 0.875rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  display: none;
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  background: #2d2d2d;
  border-radius: 20px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    left: ${(props) => (props.isNaira ? "84px" : "4px")};
    top: 4px;
    width: 72px;
    height: 32px;
    background: #3a8179;
    border-radius: 16px;
    transition: all 0.3s ease;
  }
`;

const CurrencyOption = styled.span`
  position: relative;
  z-index: 1;
  display: inline-block;
  width: 76px;
  text-align: center;
  color: ${(props) => (props.active ? "#fff" : "#9ca3af")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  transition: all 0.3s ease;
`;
const Trade = () => {
  const NGN_TO_USD = 1700;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showNumbers, setShowNumbers] = useState(false);
  const [capital, setCapital] = useState((2298.303).toFixed(2));
  const [isNaira, setIsNaira] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubtractInput, setShowSubtractInput] = useState(false);
  const [amountToSubtract, setAmountToSubtract] = useState("");
  const [newCapitalAfterSubtract, setNewCapitalAfterSubtract] = useState(0);
  const resignationDate = "Dec 24 2025";

  const handleCurrencyChange = () => {
    const newIsNaira = !isNaira;
    setIsNaira(newIsNaira);

    if (capital) {
      const currentCapital = parseFloat(capital);
      const newCapital = newIsNaira
        ? currentCapital * NGN_TO_USD
        : currentCapital / NGN_TO_USD;
      setCapital(newCapital.toString());
    }
  };

  const formatCurrency = (amount, isNaira) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: isNaira ? "NGN" : "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const maskNumber = (value) => {
    if (!showNumbers) {
      return "****";
    }
    return value;
  };

  const dailyProfits = [];

  return (
    <Container>
      <Header>
        <h2>Signal Profit Calculator</h2>
        {/* Add navigation links here */}
        <ToggleButton onClick={() => setShowNumbers(!showNumbers)}>
          <IconWrapper>
            {showNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconWrapper>
          <ButtonText>{showNumbers ? "Hide Value" : "Show Value"}</ButtonText>
        </ToggleButton>
      </Header>
      <InputGroup>
        <FormGroup>
          <Label>Capital Amount ({isNaira ? "NGN" : "USD"})</Label>
          <Input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Enter capital amount"
          />
        </FormGroup>

        <FormGroup>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormGroup>
      </InputGroup>
      <CurrencySection>
        <CapitalDisplay>
          <CapitalIcon>
            <DollarSign size={24} />
          </CapitalIcon>
          <CapitalInfo>
            <CapitalLabel>Starting Capital</CapitalLabel>
            <CapitalValue>
              {/* showNumbers show else mask */}
              {maskNumber(formatCurrency(parseFloat(capital), isNaira))}
            </CapitalValue>
          </CapitalInfo>
        </CapitalDisplay>
        {dailyProfits.length > 0 && (
          <DateRangeDisplay>
            <DateIcon>
              <Calendar size={24} />
            </DateIcon>
            <DateInfo>
              <DateLabel>Date Range</DateLabel>
              <DateRange>
                {new Date(startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <DateDivider>→</DateDivider>
                {new Date(endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </DateRange>
            </DateInfo>
          </DateRangeDisplay>
        )}

        <StyledToggleContainer>
          <CurrencyIcon>
            <ArrowRightLeft size={24} />
          </CurrencyIcon>
          <div>
            <Label>Select Currency:</Label>
            <ToggleLabel>
              <ToggleInput
                type="checkbox"
                checked={isNaira}
                onChange={handleCurrencyChange}
              />
              <ToggleSwitch isNaira={isNaira}>
                <CurrencyOption active={!isNaira}>USD</CurrencyOption>
                <CurrencyOption active={isNaira}>NGN</CurrencyOption>
              </ToggleSwitch>
            </ToggleLabel>
          </div>
        </StyledToggleContainer>
      </CurrencySection>
    </Container>
  );
};

export default Trade;
