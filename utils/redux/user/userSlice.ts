import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

type UserState = {
  user: User | undefined;
};

const initialState: UserState = {
  user: undefined,
};

// ASYNC SLICE FIX
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const googleLogin = createAsyncThunk("user/googleLogin", async () => {
  const res = await fetch("/api/login", {
    method: "GET",
  });
  const result = await res.json();
  return result.user;
});

export default userSlice.reducer;
