import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { refreshToken } from "../../redux/features/authSlice";
import Loading from "../common/Loading";
import SideBar from "../common/SideBar";
import boardApi from "../../api/boardApi";
import { setBoards } from "../../redux/features/boardSlice";
const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, token } = useSelector((state) => state.auth);
  const [logged, setLogged] = useState(localStorage.getItem("logged"));

  useEffect(() => {
    if (logged) {
      dispatch(refreshToken())
        .unwrap()
        .then(async (res) => {
          if (token) {
            const res1 = await boardApi.getAll(res.token);
            dispatch(setBoards(res1));
          }
        })
        .catch((err) => {});
    }
  }, [dispatch, logged, token]);

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
