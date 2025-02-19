import React, { useState } from "react";
import styled from "styled-components";
import { DialogContent, Dialog } from "@/components/ui/dialog";

const ModalContent = styled(DialogContent)`
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${(props) => props.theme.primary};
  color: white;
`;

const CancelButton = styled(Button)`
  background: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
`;

const WithdrawalModal = ({
  isOpen,
  onClose,
  onConfirm,
  currency,
  calculateProfitUntilDate,
}) => {
  const [amount, setAmount] = useState("");
  const [withdrawalDate, setWithdrawalDate] = useState("");
  const [signalPreference, setSignalPreference] = useState("1");
  const [estimatedBalance, setEstimatedBalance] = useState(null);

  const handleDateChange = (date) => {
    setWithdrawalDate(date);
    const balance = calculateProfitUntilDate(date, signalPreference);
    setEstimatedBalance(balance);
  };

  const handleSubmit = () => {
    onConfirm({
      amount: parseFloat(amount),
      date: withdrawalDate,
      signalPreference: parseInt(signalPreference),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalTitle>Schedule Future Withdrawal</ModalTitle>

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
            onChange={(e) => setSignalPreference(e.target.value)}
          >
            <option value="1">First Signal</option>
            <option value="2">Second Signal</option>
          </Select>
        </FormGroup>

        {estimatedBalance && (
          <FormGroup>
            <Label>Estimated Balance at Withdrawal Date</Label>
            <div
              style={{
                padding: "0.5rem",
                background: (props) => props.theme.inputBg,
                borderRadius: "0.375rem",
              }}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(estimatedBalance)}
            </div>
          </FormGroup>
        )}

        <FormGroup>
          <Label>Withdrawal Amount ({currency})</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
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
      </ModalContent>
    </Dialog>
  );
};

export default WithdrawalModal;
