import React, { useState, useMemo } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import useAuthStore from "../store/authStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MonthlyDetails from "./MonthlyDetails";

const lightTheme = {
  primary: "#3B82F6",
  background: "#FFFFFF",
  cardBg: "#FFFFFF",
  text: "#1F2937",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
  inputBg: "#F9FAFB",
  shadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const darkTheme = {
  primary: "#60A5FA",
  background: "#111827",
  cardBg: "#1F2937",
  text: "#F9FAFB",
  secondaryText: "#9CA3AF",
  border: "#374151",
  error: "#F87171",
  inputBg: "#374151",
  shadow: "0 1px 3px rgba(0,0,0,0.3)",
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: all 0.3s ease;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  gap: 20px;
  .inner {
    width: 400px;
    /* flex: 1; */
    /* padding: 2rem; */
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme.cardBg};
  border-radius: 0.5rem;
  box-shadow: ${(props) => props.theme.shadow};
  margin-bottom: 1rem;
  border: 1px solid ${(props) => props.theme.border};
  max-width: 400px;
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const Balance = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme.border};
  background-color: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.error};
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.error}11;
  border: 1px solid ${(props) => props.theme.error}33;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${(props) => props.theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div``;

const TransactionName = styled.div`
  font-weight: 500;
  color: ${(props) => props.theme.text};
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.secondaryText};
`;

const TransactionAmount = styled.div`
  color: ${(props) => props.theme.error};
  font-weight: 500;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.inputBg};
  }
`;

const CurrencyToggle = styled(Button)`
  margin-bottom: 1rem;
  background-color: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};

  &:hover {
    background-color: ${(props) => props.theme.inputBg};
  }
`;

const TotalSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.border};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ConvertedAmount = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.secondaryText};
  margin-top: 0.25rem;
`;

const Withdraw = () => {
  const { user } = useAuthStore();
  const [isDarkTheme, setIsDarkTheme] = useState(!false);
  const [balance, setBalance] = useState(user.running_capital);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("USD");

  const NGN_RATE = 1800;

  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat("en-US").format(parseFloat(number).toFixed(2));
  };

  const convertAmount = (amount, to) => {
    if (to === "NGN") {
      return amount * NGN_RATE;
    }
    return amount / NGN_RATE;
  };

  const formatAmount = (amount, curr = currency) => {
    const formattedNumber = formatNumberWithCommas(amount);
    return curr === "USD" ? `$${formattedNumber}` : `₦${formattedNumber}`;
  };

  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  // Calculate totals using useMemo
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const amountInUSD =
          transaction.currency === "NGN"
            ? transaction.amount / NGN_RATE
            : transaction.amount;

        const amountInNGN =
          transaction.currency === "USD"
            ? transaction.amount * NGN_RATE
            : transaction.amount;

        return {
          USD: acc.USD + amountInUSD,
          NGN: acc.NGN + amountInNGN,
          count: acc.count + 1,
        };
      },
      { USD: 0, NGN: 0, count: 0 }
    );
  }, [transactions]);

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);

    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const withdrawAmountUSD =
      currency === "NGN" ? withdrawAmount / NGN_RATE : withdrawAmount;

    if (withdrawAmountUSD > balance) {
      setError("Insufficient balance");
      return;
    }

    setBalance((prevBalance) => prevBalance - withdrawAmountUSD);
    setTransactions((prevTransactions) => [
      {
        id: Date.now(),
        name,
        amount: withdrawAmount,
        currency: currency,
        date: new Date().toLocaleString(),
      },
      ...prevTransactions,
    ]);

    setName("");
    setAmount("");
    setError("");
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"));
    setAmount("");
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const displayBalance =
    currency === "USD" ? balance : convertAmount(balance, "NGN");

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Container>
        {/*  */}
        <div className="inner">
          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <Balance>
                {isBalanceVisible ? formatAmount(displayBalance) : "****"}
                <button
                  onClick={toggleBalanceVisibility}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  {isBalanceVisible ? (
                    <FaEyeSlash color="#fff" />
                  ) : (
                    <FaEye color="#fff" />
                  )}
                </button>
              </Balance>
              <CurrencyToggle onClick={toggleCurrency}>
                Switch to {currency === "USD" ? "NGN" : "USD"}
              </CurrencyToggle>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Make a Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Amount ({currency})</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount in ${currency}`}
                  min="0"
                  step="0.01"
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Button onClick={handleWithdraw}>Withdraw</Button>
            </CardContent>
          </Card> */}
        </div>
        <div className="inner">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <TransactionItem>No transactions yet</TransactionItem>
              ) : (
                <>
                  {transactions.map((transaction) => (
                    <TransactionItem key={transaction.id}>
                      <TransactionInfo>
                        <TransactionName>{transaction.name}</TransactionName>
                        <TransactionDate>{transaction.date}</TransactionDate>
                      </TransactionInfo>
                      <div>
                        <TransactionAmount>
                          {transaction.currency === "USD"
                            ? `$${formatNumberWithCommas(transaction.amount)}`
                            : `₦${formatNumberWithCommas(transaction.amount)}`}
                        </TransactionAmount>
                        <ConvertedAmount>
                          {transaction.currency === "USD"
                            ? `(₦${formatNumberWithCommas(
                                transaction.amount * NGN_RATE
                              )})`
                            : `($${formatNumberWithCommas(
                                transaction.amount / NGN_RATE
                              )})`}
                        </ConvertedAmount>
                      </div>
                    </TransactionItem>
                  ))}

                  <TotalSection>
                    <TotalRow>
                      <span>Total Transactions:</span>
                      <span>{totals.count} items</span>
                    </TotalRow>
                    <TotalRow>
                      <span>Total Amount (USD):</span>
                      <span>{formatAmount(totals.USD, "USD")}</span>
                    </TotalRow>
                    <TotalRow>
                      <span>Total Amount (NGN):</span>
                      <span>{formatAmount(totals.NGN, "NGN")}</span>
                    </TotalRow>
                  </TotalSection>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {/*  */}
      </Container>
      <MonthlyDetails initialCapital={user.running_capital} />
    </ThemeProvider>
  );
};

export default Withdraw;
