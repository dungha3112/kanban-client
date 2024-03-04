import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Meta from "../components/common/Meta";
import { forgotPassword } from "../redux/features/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [emailErrText, setEmailErrText] = useState("");
  const [errText, setErrText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const email = data.get("email").trim();
    let err = false;
    if (email === "") {
      err = true;
      setEmailErrText("Please fill the email.");
    }
    if (err) return;
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((res) => alert(res.msg))
      .catch((err) => setErrText(err));
  };
  return (
    <>
      <Meta title="Forgot Password" />

      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          type="text"
          disabled={isLoading}
          error={emailErrText !== ""}
          helperText={emailErrText}
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
          Submit
        </LoadingButton>

        <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
          Already have an account? Login
        </Button>
      </Box>
    </>
  );
};

export default ForgotPassword;
