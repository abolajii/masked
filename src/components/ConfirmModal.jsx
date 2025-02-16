import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Darker overlay */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #1e1e1e; /* Dark background */
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  width: 300px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
`;

const ConfirmButton = styled(Button)`
  background: #ff4c4c;
  color: white;

  &:hover {
    background: #ff1f1f;
  }
`;

const CancelButton = styled(Button)`
  background: #444;
  color: white;

  &:hover {
    background: #666;
  }
`;

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Are you sure?</h3>
        <p>This action cannot be undone.</p>
        <ButtonContainer>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
