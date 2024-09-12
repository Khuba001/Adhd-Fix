import { useState } from "react";

const days = ["day", "work"];

const date = new Date();

export default function App() {
  const [tasks, setTasks] = useState([]);

  function handleSubmit(task) {
    setTasks(() => [...tasks, task]);
  }
  return (
    <div className="App">
      <NavBar />
      <Main handleSubmit={handleSubmit} tasks={tasks} />
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

function Main({ handleSubmit, tasks }) {
  return (
    <div className="main">
      <WelcomeMessage />
      <Form handleSubmit={handleSubmit} />
      <TaskList tasks={tasks} />{" "}
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="welcome-message">
      <div className="welcome-day">
        <span className="day-number">{date.toDateString().split(" ")[0]}</span>
        <span className="weekday">{date.getDate()}</span>
      </div>
      <div className="welcome-container">
        <h2 className="welcome-text">
          {date.getHours() >= 5 && date.getHours() <= 12 ? "Good Morning." : ""}
          {date.getHours() >= 13 && date.getHours() <= 18
            ? "Good Afternoon."
            : ""}
          {date.getHours() >= 19 && date.getHours() <= 24
            ? "Good Evening."
            : "Good Night"}
        </h2>
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

function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((_, i) => (
        <TaskListItem key={i} />
      ))}
    </ul>
  );
}

function TaskListItem() {
  return (
    <li>
      <div>siema</div>
    </li>
  );
}

function Actions() {
  return <div className="actions">siema</div>;
}
