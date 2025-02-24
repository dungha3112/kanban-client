import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Meta from "../components/common/Meta";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetStateAuth } from "../redux/features/authSlice";

const Register = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
  const [errText, setErrText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrText("");
    setConfirmPasswordErrText("");

    const data = new FormData(e.target);
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();
    let err = false;
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

    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then((res) => {
        localStorage.setItem("logged", "success");
        navigate("/");
        dispatch(resetStateAuth());
      })
      .catch((err) => {
        setErrText(err);
        setTimeout(() => {
          // navigate("/");
        }, 2000);
      });
  };

  return (
    <>
      <Meta title="Register" />
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
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
          Submit
        </LoadingButton>
      </Box>
    </>
  );
};

export default Register;
