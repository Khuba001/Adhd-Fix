import { useState } from "react";

const days = ["day", "work"];

const date = new Date();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  function handleSubmit(task) {
    const newTask = {
      id: crypto.randomUUID(),
      name: task,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setTasks(() => [...tasks, newTask]);
  }
  function handleCompleteTask(id) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  }
  function handleRemovingTask(id) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }
  return (
    <div className="App">
      <NavBar />
      <Main
        handleSubmit={handleSubmit}
        tasks={tasks}
        handleCompleteTask={handleCompleteTask}
        handleRemovingTask={handleRemovingTask}
      />
      <Actions />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar">
      <Logo />
      <NavList />
    </nav>
  );
}

function Logo() {
  return <img src="logoNav.png" alt="App logo"></img>;
}

function NavList() {
  const [activeIndex, setActiveIndex] = useState(null);
  function handleClick(index) {
    setActiveIndex(index);
  }
  return (
    <div className="nav-list-container">
      <h3>My Lists:</h3>
      <ul className="nav-list">
        {days.map((_, i) => (
          <NavListItem
            isActive={i === activeIndex}
            onClick={() => handleClick(i)}
            key={days[i]}
          />
        ))}
      </ul>
    </div>
  );
}

function NavListItem({ onClick, isActive }) {
  return (
    <li className={`nav-list-item ${isActive ? "active" : ""}`}>
      <button onClick={onClick}>Siema</button>
      {isActive ? <p>X</p> : ""}
    </li>
  );
}

function Main({ handleSubmit, tasks, handleCompleteTask, handleRemovingTask }) {
  return (
    <div className="main">
      <WelcomeMessage />
      <Form handleSubmit={handleSubmit} />
      <TaskList
        tasks={tasks}
        handleCompleteTask={handleCompleteTask}
        handleRemovingTask={handleRemovingTask}
      />{" "}
    </div>
  );
}

function WelcomeMessage() {
  const hours = date.getHours();
  let greeting;

  if (hours >= 5 && hours <= 12) {
    greeting = "Good Morning.";
  } else if (hours >= 13 && hours <= 18) {
    greeting = "Good Afternoon.";
  } else if (hours >= 19 && hours <= 24) {
    greeting = "Good Evening.";
  } else {
    greeting = "Good Night.";
  }

  return (
    <div className="welcome-message">
      <div className="welcome-day">
        <span className="day-number">{date.toDateString().split(" ")[0]}</span>
        <span className="weekday">{date.getDate()}</span>
      </div>
      <div className="welcome-container">
        <h2 className="welcome-text">{greeting}</h2>
        <p className="welcome-question">What's your plan for today?</p>
      </div>
    </div>
  );
}

function Form({ handleSubmit }) {
  const [task, getTask] = useState("");
  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(task);
    getTask("");
  }

  return (
    <form className="form" onSubmit={(e) => onSubmit(e)}>
      <input
        value={task}
        onChange={(e) => getTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function TaskList({ tasks, handleCompleteTask, handleRemovingTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task, i) => (
        <TaskListItem
          task={task}
          key={i}
          handleCompleteTask={handleCompleteTask}
          handleRemovingTask={handleRemovingTask}
        />
      ))}
    </ul>
  );
}

function TaskListItem({ task, handleCompleteTask, handleRemovingTask }) {
  return (
    <li>
      <div className="task-left">
        <button
          onClick={() => handleCompleteTask(task.id)}
          className="task-complete"
          style={{ backgroundColor: task.isCompleted && "#101213" }}
        ></button>{" "}
        <span>{task.name}</span>{" "}
      </div>
      <button
        className="task-remove"
        onClick={() => handleRemovingTask(task.id)}
      ></button>
    </li>
  );
}

function Actions() {
  return <div className="actions">siema</div>;
}
