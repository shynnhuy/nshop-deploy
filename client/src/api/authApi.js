import api from "./index";

class AuthApi {
  login = ({ email, password }) => {
    return api.post(`/auth/login`, { email, password });
  };
  register = (newUser) => {
    return api.post("/auth/register", newUser);
  };
  logout = () => {
    return api.post("/auth/logout");
  };
  loadProfile = () => {
    return api.get("/auth/userData");
  };
  refreshToken = (refreshToken) => {
    return api.post("/auth/refreshToken", { refreshToken });
  };
}

export const authApi = new AuthApi();
