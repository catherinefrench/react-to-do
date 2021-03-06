import React, { useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  InProgress: task=> task.inProgress,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  const toggleTaskCompleted = (id) => {
    // console.log("inside toggleTaskCompleted");
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed} 
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const toggleTaskInProgress = (id) => { 
    const updatedTasks = tasks.map(task => {  
      if (id === task.id) { 
        return {...task, inProgress: !task.inProgress} 
      } 
      return task;
    })
    setTasks(updatedTasks);
  }

  const addTask = (name) => {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }
  const deleteTask = (id) => {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  const editTask = (id, newName) => {
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])  
  .map(task => (
    <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        inProgress={task.inProgress}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        toggleTaskInProgress={toggleTaskInProgress}
        deleteTask={deleteTask}
        editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton 
      key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));



//maps over the button state isPressed, if true returns that button name to find active tab
  const activeButtonState = Object.keys(filterList).map(function(key) {
    if (filterList[key].props.isPressed) {
      return filterList[key].props.name;
    }   
  });
  //converts the array returned from finding active button state to string without any ","
  const activeButtonStateString = (activeButtonState) => {
    return activeButtonState.join().replace(/[^a-zA-Z]/g,"");
  }

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} ${activeButtonStateString(activeButtonState)}`;
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}  />
      <div className="filters btn-group stack-exception">
      {filterList} 
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
