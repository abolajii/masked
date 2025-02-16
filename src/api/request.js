import { authSignal, noauthSignal } from ".";

export const logIn = async (data) => {
  const response = await noauthSignal.post("/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await authSignal.get("/me");
  return response.data;
};

export const updateRecentCapital = () => {
  return authSignal.get("/update-capital");
};

export const addDeposit = async (data) => {
  console.log(data);
  try {
    const response = await authSignal.post("/add/deposit", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllDeposits = async () => {
  try {
    const response = await authSignal.get("/deposits");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDeposit = async (id) => {
  try {
    const response = await authSignal.delete(`/delete/deposit/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSignalForTheDay = async () => {
  try {
    const response = await authSignal.get("/signal");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
