import { Box, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import assets from "../../assets";
import Loading from "../common/Loading";

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(localStorage.getItem("logged"));

  useEffect(() => {
    setLogged(localStorage.getItem("logged"));
    if (logged !== "success") {
      setLoading(false);
      navigate("/login");
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [logged, navigate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={assets.images.logoDark}
          alt="Logo dark"
          style={{ width: "100px" }}
        />
        <Outlet />
      </Box>
    </Container>
  );

  // return (
  //   <Container component="main" maxWidth="xs">
  //     <Box
  //       sx={{
  //         marginTop: 8,
  //         display: "flex",
  //         alignItems: "center",
  //         flexDirection: "column",
  //       }}
  //     >
  //       <img
  //         src={assets.images.logoDark}
  //         alt="Logo dark"
  //         style={{ width: "100px" }}
  //       />
  //       <Outlet />
  //     </Box>
  //   </Container>
  // );
};

export default AuthLayout;
