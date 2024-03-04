import {
  DeleteOutlined,
  StarBorderOutlined,
  StarOutlined,
} from "@mui/icons-material";
import Moment from "moment";

import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";
import { setBoards } from "../redux/features/boardSlice";
import { setFavouriteList } from "../redux/features/favouriteSlice";
import Meta from "../components/common/Meta";

let timer;
const timeout = 500;
const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [icon, setIcon] = useState("");
  const [isFavourite, setIsFavourite] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingFavourite, setLoadingFavourite] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const boards = useSelector((state) => state.board.value);
  const favouriteList = useSelector((state) => state.favourites.value);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getBoardById(boardId, token);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIsFavourite(res.favourite);
        setIcon(res.icon);
      } catch (err) {
        // alert(err);
      }
    };
    getBoard();
  }, [boardId, dispatch, token]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };
    setIcon(newIcon);

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e._id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        icon: newIcon,
      };
      dispatch(setFavouriteList(tempFavourite));
    }

    dispatch(setBoards(temp));
    try {
      await boardApi.updateBoardById(boardId, { icon: newIcon }, token);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e._id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        title: newTitle,
      };
      dispatch(setFavouriteList(tempFavourite));
    }

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.updateBoardById(boardId, { title: newTitle }, token);
      } catch (error) {
        alert(error.response.data.msg);
      }
    }, timeout);
  };
  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);

    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === boardId);
    temp[index] = { ...temp[index], description: newDescription };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e._id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        description: newDescription,
      };
      dispatch(setFavouriteList(tempFavourite));
    }

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.updateBoardById(
          boardId,
          { description: newDescription },
          token
        );
      } catch (error) {
        alert(error.response.data.msg);
      }
    }, timeout);
  };

  const addFavourite = async () => {
    try {
      setLoadingFavourite(true);
      const board = await boardApi.updateBoardById(
        boardId,
        { favourite: !isFavourite },
        token
      );
      let newFavouriteList = [...favouriteList];
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter((e) => e._id !== boardId);
      } else {
        newFavouriteList.unshift(board);
      }

      setIsFavourite(!isFavourite);
      dispatch(setFavouriteList(newFavouriteList));
      setLoadingFavourite(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const deleteBoard = async () => {
    try {
      setLoadingDelete(true);

      await boardApi.deleteBoardById(boardId, token);
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter((e) => e._id !== boardId);
        dispatch(setFavouriteList(newFavouriteList));
      }

      const newList = boards.filter((e) => e._id !== boardId);

      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0]._id}`);
      }
      dispatch(setBoards(newList));
      setLoadingDelete(false);
    } catch (error) {
      alert(error.response.data.msg);
      setLoadingDelete(false);
    }
  };
  return (
    <>
      <Meta title="Home" />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          gap={2}
        >
          <IconButton
            variant="outlined"
            onClick={addFavourite}
            disabled={loadingFavourite}
          >
            {isFavourite ? (
              loadingFavourite ? (
                <CircularProgress size="1rem" />
              ) : (
                <StarOutlined color="warning" />
              )
            ) : loadingFavourite ? (
              <CircularProgress size="1rem" />
            ) : (
              <StarBorderOutlined />
            )}
          </IconButton>

          <Typography>
            {Moment(boards.createdAt).format("YYYY-MM-DD")}
          </Typography>
        </Box>

        <IconButton
          variant="outlined"
          color="error"
          onClick={deleteBoard}
          disabled={loadingDelete}
          title="Delete board"
        >
          {loadingDelete ? (
            <CircularProgress size="1rem" />
          ) : (
            <DeleteOutlined />
          )}
        </IconButton>
      </Box>

      <Box sx={{ padding: "10px 50px" }}>
        <Box>
          {/* EmojiPicker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />

          <TextField
            value={title}
            onChange={updateTitle}
            placeholder="Untitled"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": {
                fontSize: "2rem",
                fontWeight: "700",
              },
            }}
          />

          <TextField
            value={description}
            onChange={updateDescription}
            placeholder="Add a description"
            variant="outlined"
            multiline
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
            }}
          />
        </Box>

        <Box>
          <Kanban data={sections} boardId={boardId} />
          {/* Banban app */}
        </Box>
      </Box>
    </>
  );
};

export default Board;
