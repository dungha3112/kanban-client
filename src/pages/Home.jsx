import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import Meta from "../components/common/Meta";
import { setBoards } from "../redux/features/boardSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const addBoard = async () => {
    setLoading(true);
    if (token) {
      try {
        const res = await boardApi.create(token);
        dispatch(setBoards([res]));
        navigate(`/boards/${res.id}`);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      // navigate("/login");
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Meta title="Home" />

      <LoadingButton
        loading={loading}
        variant="outlined"
        color="success"
        onClick={addBoard}
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  );
};

export default Home;
