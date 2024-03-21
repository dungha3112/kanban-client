import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { refreshToken } from "../../redux/features/authSlice";
import Loading from "../common/Loading";
import SideBar from "../common/SideBar";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [logged, setLogged] = useState(localStorage.getItem("logged"));

  useEffect(() => {
    if (logged) {
      dispatch(refreshToken())
        .unwrap()
        .then(async (res) => {})
        .catch((err) => {});
    }
  }, [dispatch, logged]);

  useEffect(() => {
    setLogged(localStorage.getItem("logged"));
    if (logged !== "success") {
      navigate("/login");
    }
  }, [logged, navigate]);

  return isLoading ? (
    <Loading fullHeight />
  ) : (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
