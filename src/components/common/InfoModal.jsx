import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logout,
  updateInfo,
  updatePassword,
} from "../../redux/features/authSlice";
import { resetStateBoard } from "../../redux/features/boardSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const InfoModal = (props) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleCloseModal = props.onClose;

  const [userName, setUserName] = useState(user.userName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errText, setErrText] = useState("");

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (userName === user.userName) return;
    const data = { userName, token };
    setLoading(true);
    dispatch(updateInfo(data))
      .unwrap()
      .then((res) => {
        setLoading(false);
        setErrText("");
      })
      .catch((err) => {
        setErrText(err);
        setLoading(false);
      });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 8)
      return setErrText("Password must be at least 8 characters.");
    if (confirmPassword !== password) {
      return setErrText("Confirm password not match.");
    }

    const data = { password, token };
    setLoading(true);

    dispatch(updatePassword(data))
      .unwrap()
      .then((res) => {
        setLoading(false);

        localStorage.removeItem("logged");
        dispatch(logout(token));
        dispatch(resetStateBoard());

        // navigate("/login");
        setConfirmPassword("");
        setPassword("");
      })
      .catch((err) => {
        setErrText(err);
        setLoading(false);
      });
  };

  const handelRenderInfo = (index) => {
    if (index === 0) {
      return (
        <Stack spacing={2} component="form" onSubmit={handleUpdateInfo}>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Email"
            name="email"
            type="email"
            value={user.email}
            disabled
          />
          <TextField
            fullWidth
            margin="normal"
            id="userName"
            label="user name"
            name="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onFocus={() => setErrText("")}
            onClick={() => setErrText("")}
          />
          <Typography
            sx={{ textAlign: "center", fontSize: 13, color: "crimson" }}
          >
            {errText}
          </Typography>
          <LoadingButton
            variant="outlined"
            fullWidth
            type="submit"
            color="success"
            loading={loading}
          >
            Update Info
          </LoadingButton>
        </Stack>
      );
    }

    return (
      <Stack spacing={2} component="form" onSubmit={handleUpdatePassword}>
        <TextField
          margin="normal"
          fullWidth
          id="password"
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setErrText("")}
        />
        <TextField
          margin="normal"
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setErrText("")}
        />

        <Typography
          sx={{ textAlign: "center", fontSize: 13, color: "crimson" }}
        >
          {errText}
        </Typography>

        <LoadingButton
          variant="outlined"
          fullWidth
          type="submit"
          color="success"
          loading={loading}
          // disabled={password !== confirmPassword}
        >
          Update Password
        </LoadingButton>
      </Stack>
    );
  };

  return (
    <Modal open={props.open}>
      <Box sx={style}>
        <Box sx={{ textAlign: "end" }}>
          <IconButton onClick={handleCloseModal}>
            <Close color="error" />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Info" />
            <Tab label="Password" />
          </Tabs>
        </Box>

        <Box sx={{ pt: 2 }}>{handelRenderInfo(value)}</Box>
      </Box>
    </Modal>
  );
};

export default InfoModal;
