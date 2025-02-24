import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { refreshToken } from "../../redux/features/authSlice";
import Loading from "../common/Loading";
import SideBar from "../common/SideBar";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, token } = useSelector((state) => state.auth);
  const [logged, setLogged] = useState(localStorage.getItem("logged"));

  useEffect(() => {
    setLogged(localStorage.getItem("logged"));
    if (!logged) return;
    dispatch(refreshToken())
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        // localStorage.clear("logged");
        // navigate("/login");
      });
  }, [dispatch, logged]);

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
