import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import ConfirmModal from "../components/ConfirmModal";
import MakeDeposit from "./MakeDeposit";
import { deleteDeposit, getAllDeposits } from "../api/request";
import useAuthStore from "../store/authStore";

const TableContainer = styled.div`
  /* margin: 32px; */
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  color: #e0e0e0;
`;

const Title = styled.h2``;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #25262b;
  color: #a0a0a0;
  font-weight: 500;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #2c2d30;
  color: #ffffff;
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Amount = styled.span`
  color: #4caf50;
  font-weight: 500;
`;

const Status = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;

  ${(props) => {
    switch (props.status) {
      case "completed":
        return `
          background: #2e7d32;
          color: #c8e6c9;
        `;
      case "pending":
        return `
          background: #ef6c00;
          color: #ffe0b2;
        `;
      case "failed":
        return `
          background: #c62828;
          color: #ffcdd2;
        `;
      default:
        return "";
    }
  }}
`;

const TradeTime = styled.span`
  text-transform: capitalize;
`;

const NoData = styled.div`
  text-align: center;
  padding: 32px;
  color: #b0b0b0;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
  margin: 0;
  background: #2a2a2a;
  border-bottom: 1px solid #444;
  color: #ffffff;

  button {
    background: #ee9235;
    color: #ffffff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.1s ease-in-out;

    &:hover {
      background: #d07f2d;
    }
  }
`;

const Action = styled.button`
  border: 1px solid #dd3e3e;
  color: #dd3e3e;
  cursor: pointer;
  transition: background-color 0.2s;

  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: transparent;

  &:hover {
    background-color: #e0313150;
    border: 1px solid transparent;
  }
`;

const DepositHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const { setUser, user } = useAuthStore();

  const fetchDeposits = async () => {
    const response = await getAllDeposits();
    console.log(response);
    setDeposits(response.deposits);
  };
  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = () => {
    setIsCloseModalOpen(true);
  };

  const confirmDelete = async () => {
    // alert(`Item Deleted!, ${selectedDeposit._id}`);
    setIsCloseModalOpen(false);

    try {
      const response = await deleteDeposit(selectedDeposit._id);
      console.log(response);

      const clonedDeposits = [...deposits];
      const index = clonedDeposits.findIndex(
        (d) => d._id === selectedDeposit._id
      );
      clonedDeposits.splice(index, 1);
      setDeposits(clonedDeposits);

      const startingCapital = response.data.startingCapital;
      const updatedUser = { ...user, startingCapital };
      setUser(updatedUser);
    } catch (error) {}
  };

  const cancelDelete = () => {
    setIsCloseModalOpen(false);
  };

  // if (deposits.length === 0) {
  //   return (
  //     <TableContainer>
  //       <Title>Deposit History</Title>
  //       <NoData>No deposits found</NoData>
  //     </TableContainer>
  //   );
  // }

  return (
    <TableContainer>
      {isModalOpen && (
        <MakeDeposit
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          fetchDeposits={fetchDeposits}
        />
      )}

      <ConfirmModal
        isOpen={isCloseModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Top>
        <Title>Deposit History</Title>
        <button onClick={handleOpenModal}>Make Deposit</button>
      </Top>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Trade Time</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit._id}>
              <Td>#</Td>
              <Td>
                <Amount>
                  $
                  {deposit.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Amount>
              </Td>
              <Td>{format(deposit.date, "MMM dd, yyyy")}</Td>
              <Td>
                <TradeTime>
                  {deposit.whenDeposited.split("-").join(" ")}
                </TradeTime>
              </Td>
              <Td>
                <Status status={"completed"}>{"completed"}</Status>
              </Td>
              <Td>
                <Action
                  onClick={() => {
                    handleDelete();
                    setSelectedDeposit(deposit);
                  }}
                >
                  Delete
                </Action>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default DepositHistory;
