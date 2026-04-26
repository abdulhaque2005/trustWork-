import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout as logoutAction } from "../store/slices/authSlice.js";

export const useAuth = () => {
  const { user, isLoggedIn, registeredUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = (userData) => {
    dispatch(loginSuccess(userData));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return { user, isLoggedIn, registeredUsers, login, logout, dispatch };
};
