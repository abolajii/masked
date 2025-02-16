import { authSignal, noauthSignal } from ".";

export const logIn = async (data) => {
  const response = await noauthSignal.post("/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await authSignal.get("/me");
  return response.data;
};

export const updateRecentCapital = (recentCapital) => {
  return authSignal.put("/recent-capital", { recentCapital });
};
