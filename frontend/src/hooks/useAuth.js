import { useSelector, useDispatch } from "react-redux";
import { loginUserAsync, registerUserAsync, logout as logoutAction, clearError } from "../store/slices/authSlice.js";

export const useAuth = () => {
  const { user, isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = (credentials) => dispatch(loginUserAsync(credentials));
  const register = (userData) => dispatch(registerUserAsync(userData));
  const logout = () => dispatch(logoutAction());
  const resetError = () => dispatch(clearError());

  return { user, isLoggedIn, loading, error, login, register, logout, resetError, dispatch };
};
