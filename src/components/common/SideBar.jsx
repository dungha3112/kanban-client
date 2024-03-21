import { AddBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import boardApi from "../../api/boardApi";
import assets from "../../assets";
import { logout, resetStateAuth } from "../../redux/features/authSlice";
import { resetStateBoard, setBoards } from "../../redux/features/boardSlice";
import FavouriteList from "./FavouriteList";
import InfoModal from "./InfoModal";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const boards = useSelector((state) => state.board.value);

  const sidebarWidth = 250;
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll(token);
        dispatch(setBoards(res));
      } catch (err) {}
    };
    getBoards();
  }, [dispatch, token]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e._id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0]._id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  const handleLogout = async () => {
    setLoadingLogout(true);
    dispatch(logout(token))
      .unwrap()
      .then((res) => {
        setLoadingLogout(false);
        dispatch(resetStateAuth());
        dispatch(resetStateBoard());
      })
      .catch((err) => {
        alert(err);
      });
    localStorage.removeItem("logged");
    navigate("/login");

    setLoadingLogout(false);
  };

  const onDragEnd = async ({ source, description }) => {
    const newList = [...boards];

    const [removed] = newList.splice(source?.index, 1);
    newList.splice(description?.index, 0, removed);

    const activeItem = newList.findIndex((e) => e._id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));
    try {
      await boardApi.updatePosition({ boards: newList }, token);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const addBoard = async () => {
    setLoading(true);
    if (user) {
      try {
        const res = await boardApi.create(token);
        const newList = [res, ...boards];
        dispatch(setBoards(newList));
        navigate(`/boards/${res.id}`);
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Drawer
        container={window.document.body}
        variant="permanent"
        open={true}
        sx={{
          width: sidebarWidth,
          height: "100vh",
          "& > div": { borderRight: "none" },
        }}
      >
        <List
          disablePadding
          sx={{
            width: sidebarWidth,
            height: "100vh",
            backgroundColor: assets.colors.secondary,
          }}
        >
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 1,
                }}
              >
                {/* <Avatar src={user.avatar.url} /> */}
                <Typography
                  variant="body2"
                  fontWeight="700"
                  onClick={() => setOpenInfo(true)}
                >
                  {user.userName}
                </Typography>
              </Box>
              <IconButton onClick={handleLogout} disabled={loadingLogout}>
                {loadingLogout ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <LogoutOutlined fontSize="small" />
                )}
              </IconButton>
            </Box>
          </ListItem>

          <Box sx={{ paddingTop: "10px" }} />
          <FavouriteList />

          <Box sx={{ paddingTop: "10px" }} />
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight="700">
                Private
              </Typography>

              <IconButton onClick={addBoard} disabled={loading}>
                {loading ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <AddBoxOutlined fontSize="small" />
                )}
              </IconButton>
            </Box>
          </ListItem>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              key={"list-board-droppable-key"}
              droppableId={"list-board-droppable"}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {boards.length > 0 &&
                    boards.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItemButton
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={index === activeIndex}
                            component={Link}
                            to={`/boards/${item._id}`}
                            sx={{
                              pl: "20px",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.icon} {item.title}
                            </Typography>
                          </ListItemButton>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Drawer>

      <InfoModal open={openInfo} onClose={() => setOpenInfo(false)} />
    </>
  );
};

export default SideBar;
