import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDeposit } from "../api/request";
import useAuthStore from "../store/authStore";

const FormContainer = styled.div`
  max-width: 600px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 20px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background: ${(props) => (props.disabled ? "#ccc" : "#ff9800")};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  width: 100%;
  transition: background 0.3s;
  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#f57c00")};
  }
`;

const ErrorMessage = styled.div`
  color: #ef0b0b;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 9px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  font-size: 14px;
  margin: 25px 0 0 0;
  padding: 8px;
  background: #e8f5e9;
  border-radius: 4px;
  text-align: center;
`;

const MakeDeposit = ({ handleCloseModal, isModalOpen, fetchDeposits }) => {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date(),
    tradeTime: "before-trade",
  });

  const { setUser, user } = useAuthStore();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    setError("");

    const { amount, date } = formData;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid deposit amount.");
      return false;
    }

    if (!date || date > new Date()) {
      setError("Date must be valid and not in the future.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      //   await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      await addDeposit(formData);
      // const startingCapital = response.data.running_capital;
      // const updatedUser = { ...user, startingCapital };
      // setUser(updatedUser);

      setFormData({
        amount: "",
        date: new Date(),
        tradeTime: "before-trade",
      });
      handleCloseModal();
      fetchDeposits();
    } catch (err) {
      setError("Failed to process deposit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={handleCloseModal} isOpen={isModalOpen}>
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormContainer>
        <FormTitle>Make a Deposit</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <StyledDatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="MMMM d, yyyy"
              id="date"
            />
          </FormGroup>

          <FormGroup>
            <Label>Trade Time</Label>
            <RadioGroup>
              {["before-trade", "inbetween-trade", "after-trade"].map(
                (option) => (
                  <RadioLabel key={option}>
                    <input
                      type="radio"
                      name="tradeTime"
                      value={option}
                      checked={formData.tradeTime === option}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tradeTime: e.target.value,
                        })
                      }
                    />
                    {option.replace("-", " ").toUpperCase()}
                  </RadioLabel>
                )
              )}
            </RadioGroup>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Deposit"}
          </SubmitButton>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default MakeDeposit;
