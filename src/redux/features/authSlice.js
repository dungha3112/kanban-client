import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

const initialState = {
  user: { _id: "", email: "", userName: "" },
  token: "",
  isLoading: false,
  isError: false,
  emailActive: { email: "", msg: "" },
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.logout(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const activeEmail = createAsyncThunk(
  "auth/active",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.activeEmail(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.forgotPassword(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (data, { rejectWithValue }) => {
    try {
      const data1 = { password: data.password, token: data.token };
      return await authApi.resetPassword(data1);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
export const refreshToken = createAsyncThunk(
  "auth/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refreshToken();
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateInfo = createAsyncThunk(
  "user/update-info",
  async (data, { rejectWithValue }) => {
    const data1 = { userName: data.userName, token: data.token };
    try {
      return await authApi.updateInfo(data1);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/update-password",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.updatePassword(data);
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const resetStateAuth = createAction("Reset_State_Auth");

export const userSlice = createSlice({
  name: "auth",
  initialState,
  //  dong bo
  reducers: {},
  // bat dong bo
  extraReducers: (builder) => {
    builder
      .addCase(resetStateAuth, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user._id = action.payload.user._id;
        state.user.email = action.payload.user.email;
        state.user.userName = action.payload.user.userName;

        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // logout
      .addCase(logout.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user._id = "";
        state.user.email = "";
        state.user.userName = "";
        state.token = "";
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // updateInfo
      .addCase(updateInfo.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.user._id = action.payload.user._id;
        state.user.email = action.payload.user.email;
        state.user.userName = action.payload.user.userName;
      })
      .addCase(updateInfo.rejected, (state) => {
        // state.isLoading = false;
        state.isError = true;
      })

      // updatePassword
      .addCase(updatePassword.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      //register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emailActive.email = action.meta.arg.email;
        state.emailActive.msg = action.payload.msg;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      //activeEmail
      .addCase(activeEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emailActive.email = "";
        state.emailActive.msg = "";
      })
      .addCase(activeEmail.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      //forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      //resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user._id = action.payload.user._id;
        state.user.email = action.payload.user.email;
        state.user.userName = action.payload.user.userName;

        state.token = action.payload.token;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // refreshToken
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user._id = action.payload.user._id;
        state.user.email = action.payload.user.email;
        state.user.userName = action.payload.user.userName;

        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
