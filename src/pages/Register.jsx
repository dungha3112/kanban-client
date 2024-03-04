import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../components/common/Meta";
import { register } from "../redux/features/authSlice";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
  const [errText, setErrText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");

    const data = new FormData(e.target);
    const email = data.get("email").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

    let err = false;
    if (email === "") {
      err = true;
      setEmailErrText("Please fill the email.");
    }
    if (password === "") {
      err = true;
      setPasswordErrText("Please fill the password.");
    }
    if (confirmPassword === "") {
      err = true;
      setConfirmPasswordErrText("Please fill the confirm password.");
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText("Confirm password not match.");
    }
    if (err) return;

    dispatch(register({ email, password }))
      .unwrap()
      .then((res) => navigate("/active"))
      .catch((err) => setErrText(err));
  };

  return (
    <>
      <Meta title="Register" />
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          disabled={isLoading}
          type="password"
          error={confirmPasswordErrText !== ""}
          helperText={confirmPasswordErrText}
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
          Register
        </LoadingButton>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
            Login
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

export default Register;
