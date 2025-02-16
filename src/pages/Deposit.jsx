import React, { useState } from "react";
import styled from "styled-components";

import DepositHistory from "./DepositHistory";

const Deposit = () => {
  const NAIRA_RATE = 1656;
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date(),
    tradeTime: "before-trade",
  });

  return (
    <>
      <DepositHistory />
    </>
  );
};

export default Deposit;
