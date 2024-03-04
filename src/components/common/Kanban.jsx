import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";
import { useSelector } from "react-redux";

let timer;
const timeout = 500;

const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  const { token } = useSelector((state) => state.auth);
  //
  const [loadingAddSection, setLoadingAddSection] = useState(false);
  const [loadingDeleteSection, setLoadingDeleteSection] = useState(false);
  const [sectionIdDelete, setSectionIdDelete] = useState("");

  const [loadingAddTask, setLoadingAddTask] = useState(false);
  const [sectionIdTask, setSectionIdTask] = useState("");

  //
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e._id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e._id === destination.droppableId
    );

    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(
        boardId,
        {
          resourceList: sourceTasks,
          destinationList: destinationTasks,
          resourceSectionId: sourceSectionId,
          destinationSectionId: destinationSectionId,
        },
        token
      );
      setData(data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const createSection = async () => {
    try {
      setLoadingAddSection(true);
      const section = await sectionApi.create(boardId, token);
      setData([...data, section]);
      setLoadingAddSection(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      setLoadingDeleteSection(true);
      setSectionIdDelete(sectionId);

      await sectionApi.delete(boardId, sectionId, token);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);

      setLoadingDeleteSection(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer);
    const newSectionTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e._id === sectionId);
    newData[index].title = newSectionTitle;
    setData(newData);

    timer = setTimeout(async () => {
      try {
        await sectionApi.update(
          boardId,
          sectionId,
          { title: newSectionTitle },
          token
        );
      } catch (error) {
        alert(error.response.data.msg);
      }
    }, timeout);
  };

  const createTask = async (sectionId) => {
    try {
      setSectionIdTask(sectionId);
      setLoadingAddTask(true);
      const task = await taskApi.create(boardId, { sectionId }, token);
      const newData = [...data];
      const index = newData.findIndex((e) => e._id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
      setLoadingAddTask(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const onUpdateTask = async (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e._id === task._id
    );

    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = async (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e._id === task._id
    );

    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          title="Add section"
          onClick={createSection}
          disabled={loadingAddSection}
          color="success"
        >
          {loadingAddSection ? (
            <CircularProgress size="1rem" />
          ) : (
            <AddOutlined />
          )}
        </IconButton>

        <Typography variant="body2" fontWeight="700">
          {data.length}
        </Typography>
      </Box>

      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "calc(100vw - 400px)",
            overflowX: "auto",
          }}
        >
          {data.map((section) => (
            <div key={section._id} style={{ width: "300px" }}>
              <Droppable key={section._id} droppableId={section._id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        value={section.title}
                        placeholder="Untitled"
                        variant="outlined"
                        onChange={(e) => updateSectionTitle(e, section._id)}
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "2rem",
                            fontWeight: "700",
                          },
                        }}
                      />
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": { color: "green" },
                        }}
                        title="Create Task"
                        onClick={() => createTask(section._id)}
                        disabled={loadingAddTask}
                      >
                        {loadingAddTask && sectionIdTask === section._id ? (
                          <CircularProgress size="1rem" />
                        ) : (
                          <AddOutlined />
                        )}
                      </IconButton>

                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": { color: "red" },
                        }}
                        disabled={loadingDeleteSection}
                        onClick={() => deleteSection(section._id)}
                        title="Delete section"
                      >
                        {loadingDeleteSection &&
                        section._id === sectionIdDelete ? (
                          <CircularProgress size="1rem" />
                        ) : (
                          <DeleteOutlined />
                        )}
                      </IconButton>
                    </Box>

                    {/* Tasks */}
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: "10px",
                              marginBottom: "10px",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography>
                              {task.title === "" ? "Untitled" : task.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>

      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
};

export default Kanban;
