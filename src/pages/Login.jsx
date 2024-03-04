import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../components/common/Meta";
import { login, resetStateAuth } from "../redux/features/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [errText, setErrText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrText("");
    setPasswordErrText("");

    const data = new FormData(e.target);
    const email = data.get("email").trim();
    const password = data.get("password").trim();

    let err = false;
    if (email === "") {
      err = true;
      setEmailErrText("Please fill the email.");
    }
    if (password === "") {
      err = true;
      setPasswordErrText("Please fill the password.");
    }

    if (err) return;
    dispatch(login({ email, password }))
      .unwrap()
      .then((res) => {
        localStorage.setItem("logged", "success");
        navigate("/");
        dispatch(resetStateAuth());
      })
      .catch((err) => setErrText(err));
  };
  return (
    <>
      <Meta title="Login" />
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          disabled={isLoading}
          type="email"
          error={emailErrText !== ""}
          helperText={emailErrText}
          onFocus={() => setErrText("")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          disabled={isLoading}
          type="password"
          error={passwordErrText !== ""}
          helperText={passwordErrText}
          onFocus={() => setErrText("")}
        />
        <Typography
          sx={{ textAlign: "center", fontSize: 13, color: "crimson" }}
        >
          {errText}
        </Typography>
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={isLoading}
        >
          Login
        </LoadingButton>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            component={Link}
            to="/register"
            sx={{ textTransform: "none" }}
          >
            Register
          </Button>
          <Button
            component={Link}
            to="/forgot-password"
            sx={{ textTransform: "none" }}
          >
            Forgot Password
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
