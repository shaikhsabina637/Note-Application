"use client"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice"

const AutoLogout = () => {
  const dispatch = useDispatch();

  const checkAutoLogout = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(loginTime);
      const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

      if (elapsedTime >= sixHours) {
        dispatch(logout());
        window.location.href = "/login"; // Redirect user
      }
    }
  };

  useEffect(() => {
    checkAutoLogout(); // Check on mount
    const interval = setInterval(checkAutoLogout, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AutoLogout;
