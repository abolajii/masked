import axios from "axios";

const BASE_URL = "http://localhost:4030/api/v1";

const getToken = () => {
  return localStorage.getItem("token");
};

const noauthSignal = axios.create({
  baseURL: BASE_URL,
});

const authSignal = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export { noauthSignal, authSignal };
