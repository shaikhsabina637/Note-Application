import { createSlice } from "@reduxjs/toolkit";
let userData = null;
let tokenFetch = null;
let isAuthenticate = false;

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  const storedAuth = localStorage.getItem("authenticated");

  if (storedUser && storedUser !== "undefined") {
    userData = JSON.parse(storedUser);
  }

  if (storedToken && storedToken !== "undefined") {
    tokenFetch = JSON.parse(storedToken);
  }

  if (storedAuth && storedAuth !== "undefined") {
    isAuthenticate = JSON.parse(storedAuth);
  }
}

const initialState = {
  user: userData,
  token: tokenFetch,
  isAuthenticated: isAuthenticate,  // ✅ consistent naming
  loader: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;  // ✅ update state

      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("authenticated", JSON.stringify(true));
         localStorage.setItem("loginTime", new Date().getTime()); 

      }
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false; // ✅ update state
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("authenticated", JSON.stringify(false)); 
         localStorage.removeItem("loginTime");
      }
    },
    deleteUser: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false; // ✅ update state
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("authenticated", JSON.stringify(false));
      }
    },
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.image = action.payload; // update redux user
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user)); // update localStorage
        }
      }
    },
  },
});

export const { login, setLoader, logout, deleteUser ,updateProfileImage} = authSlice.actions;
export default authSlice.reducer;
