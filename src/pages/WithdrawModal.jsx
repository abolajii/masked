import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const StyledOverlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 50;

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledContent = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  padding: 1.5rem;
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 51;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const StyledDialog = styled(DialogPrimitive.Root)``;

const StyledClose = styled(DialogPrimitive.Close)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.text};
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.text};
  padding-right: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
  }
`;

const EstimatedBalanceBox = styled.div`
  padding: 0.75rem;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.text};
  font-family: monospace;
  font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${(props) => props.theme.primary};
  color: white;

  &:hover {
    background: ${(props) => props.theme.primary}ee;
  }
`;

const CancelButton = styled(Button)`
  background: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};

  &:hover {
    background: ${(props) => props.theme.inputBg};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-right: 2rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const CurrencyToggle = styled.button`
  padding: 0.5rem 0.75rem;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.375rem;
  color: ${(props) => props.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.border};
  }
`;

const WithdrawalModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialCurrency = "USD",
  calculateProfitUntilDate,
}) => {
  const [amount, setAmount] = useState("");
  const [withdrawalDate, setWithdrawalDate] = useState("");
  const [signalPreference, setSignalPreference] = useState("1");
  const [estimatedBalance, setEstimatedBalance] = useState(null);
  const [currency, setCurrency] = useState(initialCurrency);
  const NGN_RATE = 1800;

  // Add useEffect to update estimated balance when currency changes
  useEffect(() => {
    if (withdrawalDate && estimatedBalance) {
      const balanceUSD = calculateProfitUntilDate(
        withdrawalDate,
        signalPreference
      );
      setEstimatedBalance(
        currency === "USD" ? balanceUSD : balanceUSD * NGN_RATE
      );
    }
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"));
    if (amount) {
      setAmount(
        currency === "USD"
          ? (parseFloat(amount) * NGN_RATE).toString()
          : (parseFloat(amount) / NGN_RATE).toString()
      );
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace("USD", "$")
      .replace("NGN", "₦");
  };

  const handleDateChange = (date) => {
    setWithdrawalDate(date);
    const balanceUSD = calculateProfitUntilDate(date, signalPreference);
    // Convert to NGN if currency is NGN
    setEstimatedBalance(
      currency === "USD" ? balanceUSD : balanceUSD * NGN_RATE
    );
  };

  const handleSignalPreferenceChange = (e) => {
    const newSignalPreference = e.target.value;
    setSignalPreference(newSignalPreference);
    if (withdrawalDate) {
      const balanceUSD = calculateProfitUntilDate(
        withdrawalDate,
        newSignalPreference
      );
      // Convert to NGN if currency is NGN
      setEstimatedBalance(
        currency === "USD" ? balanceUSD : balanceUSD * NGN_RATE
      );
    }
  };

  const handleSubmit = () => {
    const submitAmount =
      currency === "NGN" ? parseFloat(amount) / NGN_RATE : parseFloat(amount);
    onConfirm({
      amount: submitAmount,
      date: withdrawalDate,
      signalPreference: parseInt(signalPreference),
      currency: "USD", // Always store in USD
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setWithdrawalDate("");
    setSignalPreference("1");
    setEstimatedBalance(null);
    setCurrency(initialCurrency);
  };

  return (
    <StyledDialog open={isOpen} onOpenChange={onClose}>
      <StyledOverlay />
      <StyledContent>
        <ModalHeader>
          <ModalTitle>Schedule Future Withdrawal</ModalTitle>
          <HeaderActions>
            <CurrencyToggle onClick={toggleCurrency}>
              Switch to {currency === "USD" ? "NGN" : "USD"}
            </CurrencyToggle>
          </HeaderActions>
        </ModalHeader>
        <StyledClose aria-label="Close">×</StyledClose>

        <FormGroup>
          <Label>Withdrawal Date</Label>
          <Input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            max="2025-12-31"
            value={withdrawalDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>After Signal</Label>
          <Select
            value={signalPreference}
            onChange={handleSignalPreferenceChange}
          >
            <option value="1">First Signal</option>
            <option value="2">Second Signal</option>
          </Select>
        </FormGroup>

        {estimatedBalance !== null && (
          <FormGroup>
            <Label>Estimated Balance at Withdrawal Date</Label>
            <EstimatedBalanceBox>
              {formatCurrency(estimatedBalance)}
            </EstimatedBalanceBox>
          </FormGroup>
        )}

        <FormGroup>
          <Label>Withdrawal Amount ({currency})</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter amount in ${currency}`}
            min="0"
            max={estimatedBalance}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton
            onClick={handleSubmit}
            disabled={
              !amount ||
              !withdrawalDate ||
              parseFloat(amount) > (estimatedBalance || 0)
            }
          >
            Confirm
          </ConfirmButton>
        </ButtonGroup>
      </StyledContent>
    </StyledDialog>
  );
};

export default WithdrawalModal;
