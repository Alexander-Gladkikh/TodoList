import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolisTitletAC,
    removeTodolistAC, setTodolists,
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {AppRootStateType} from "./state/store";
import {useDispatch, useSelector} from "react-redux";
import {todolistAPI} from "./api/todolist-api";

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: string
}

export type TasksStateType = {
    [key: string]: TaskType[]
}


function AppWidthRedux() {

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskAC(taskId, todolistId))
    },[])
    const addTask = useCallback((taskTitle: string, todolistId: string) => {
        dispatch(addTaskAC(taskTitle, todolistId))
    },[])
    const changeTaskStatus = useCallback((taskId: string, newStatus: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, newStatus, todolistId))
    },[])
    const onChangeTaskTitle = useCallback((tasksId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(tasksId, newTitle, todolistId))

    },[])
    const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    },[])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    },[])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    },[])
    const onChangeTodolistTitle = useCallback((newTitle: string, todolistId: string) => {
        dispatch(changeTodolisTitletAC(todolistId, newTitle))
    },[])

    useEffect(() => {
        todolistAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolists(res.data.data))
            })
    },[])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tl => {

                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    task={tasks[tl.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    removeTodolist={removeTodolist}
                                    onChangeTaskTitle={onChangeTaskTitle}
                                    onChangeTodolistTitle={onChangeTodolistTitle}
                                    filter={tl.filter}
                                />
                            </Paper>
                        </Grid>

                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWidthRedux;
