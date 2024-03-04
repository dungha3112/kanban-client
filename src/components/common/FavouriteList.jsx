import { Box, ListItem, ListItemButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import boardApi from "../../api/boardApi";
import { setFavouriteList } from "../../redux/features/favouriteSlice";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const FavouriteList = () => {
  const dispatch = useDispatch();
  const boardId = useParams();
  const { token } = useSelector((state) => state.auth);
  const list = useSelector((state) => state.favourites.value);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getBoards = async () => {
      try {
        // const res = await boardApi.getFavourites(token);
        // dispatch(setFavouriteList(res));
      } catch (error) {
        alert(error.response.data.msg);
      }
    };
    if (token) {
      getBoards();
    }
  }, [dispatch, token]);

  useEffect(() => {
    const index = list.findIndex((e) => e._id === boardId);
    setActiveIndex(index);
  }, [boardId, list]);

  const onDragEnd = async ({ source, description }) => {
    const newList = [...list];

    const [removed] = newList.splice(source?.index, 1);
    newList.splice(description?.index, 0, removed);

    const activeItem = newList.findIndex((e) => e._id === boardId);
    setActiveIndex(activeItem);
    dispatch(setFavouriteList(newList));
    try {
      await boardApi.updateFavouritePosition({ boards: newList }, token);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <>
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
            Favourites
          </Typography>
        </Box>
      </ListItem>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          key={"list-board-droppable-key"}
          droppableId={"list-board-droppable"}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
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
    </>
  );
};

export default FavouriteList;
