import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../components/common/Meta";
import { activeEmail } from "../redux/features/authSlice";

const ActiveAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emailActive, isLoading } = useSelector((state) => state.auth);

  const [errOTPText, setErrOTPText] = useState("");
  const [errText, setErrText] = useState("");

  useEffect(() => {
    if (!emailActive.email) {
      navigate("/");
    }
  }, [emailActive.email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const otp = data.get("otp").trim();
    let err = false;
    if (otp === "") {
      err = true;
      setErrOTPText("Please fill the OTP.");
    }
    if (otp.length < 8) {
      err = true;
      setErrOTPText("Code otp must be at least 8 characters.");
    }
    if (err) return;

    dispatch(activeEmail({ email: emailActive.email, otp }))
      .unwrap()
      .then((res) => {
        localStorage.setItem("logged", "success");
        navigate("/");
      })
      .catch((err) => setErrText(err));
  };

  return (
    <>
      <Meta title="Active Account" />
      <Box sx={{ pt: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: "14px" }}>
          {emailActive.msg}
          <br />
          Please don't reload or close page.
        </Typography>
      </Box>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="otp"
          label="OTP"
          name="otp"
          type="text"
          disabled={isLoading}
          error={errOTPText !== ""}
          helperText={errOTPText}
          onFocus={() => {
            setErrText("");
            setErrOTPText("");
          }}
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

        <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
          Already have an account? Login
        </Button>
      </Box>
    </>
  );
};

export default ActiveAccount;
