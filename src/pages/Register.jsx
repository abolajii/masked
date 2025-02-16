import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #121212;
  color: #fff;
`;

const AuthWrapper = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  /* box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1); */
  width: 350px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin: 8px 0;
  border-radius: 5px;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
  outline: none;
  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background: #ff9800;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  &:hover {
    background: #e68900;
  }
`;

const ToggleText = styled.p`
  margin-top: 15px;
  cursor: pointer;
  color: #ff9800;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: -5px;
  margin-bottom: 5px;
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Registration successful!"); // Replace with actual API call
    }
  };

  return (
    <Container>
      <AuthWrapper>
        <Title>Register</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}

          <Button type="submit">Register</Button>
        </Form>
        <ToggleText onClick={() => navigate("/login")}>
          Already have an account? Login
        </ToggleText>
      </AuthWrapper>
    </Container>
  );
};

export default Register;
