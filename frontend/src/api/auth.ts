import { apiClient } from ".";
import type { UserLogin, UserRegister } from "../types/user";



const registerUserApi = async (user: UserRegister) => {
  return apiClient.post("/auth/register", user,{
    headers: { "Content-Type": "application/json" }
  });
};

const loginUserApi = async (user: UserLogin) => {
  return apiClient.post("/auth/login", user,{
    headers: { "Content-Type": "application/json" }
  });
};

const logOutUserApi = async () => {
  return apiClient.post("/auth/logout");
};

const fetchUserApi = async () => {
  return apiClient.get("/auth/me");
};

export {
    registerUserApi,
    loginUserApi,
    logOutUserApi,
    fetchUserApi
}