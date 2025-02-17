import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
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

const Trade = () => {
  const NGN_TO_USD = 1700;

  const [showNumbers, setShowNumbers] = useState(false);
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
    </Container>
  );
};

export default Trade;
