import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getYear,
  isEqual,
  parse,
  startOfMonth,
  startOfToday,
  sub,
} from "date-fns";
import { useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

const date = new Date();

export default function App() {
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);

  function handleSubmit(task) {
    if (!activeList) return;

    const newTask = {
      id: crypto.randomUUID(),
      name: task,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setLists((lists) => {
      const updatedLists = lists.map((list) =>
        list.id === activeList.id
          ? { ...list, tasksArr: [...list.tasksArr, newTask] }
          : list
      );

      const updatedActiveList = updatedLists.find(
        (list) => list.id === activeList.id
      );
      setActiveList(updatedActiveList);

      return updatedLists;
    });
  }
  function handleCompleteTask(id) {
    setLists((lists) => {
      const updatedLists = lists.map((list) =>
        list.id === activeList.id
          ? {
              ...list,
              tasksArr: list.tasksArr.map((task) =>
                task.id === id
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task
              ),
            }
          : list
      );

      // Aktualizuj activeList
      const updatedActiveList = updatedLists.find(
        (list) => list.id === activeList.id
      );
      setActiveList(updatedActiveList);

      return updatedLists;
    });
  }

  function handleRemovingTask(id) {
    setLists((lists) => {
      const updatedLists = lists.map((list) =>
        list.id === activeList.id
          ? {
              ...list,
              tasksArr: list.tasksArr.filter((task) => task.id !== id),
            }
          : list
      );

      // Aktualizuj activeList
      const updatedActiveList = updatedLists.find(
        (list) => list.id === activeList.id
      );
      setActiveList(updatedActiveList);

      return updatedLists;
    });
  }

  function handleAddingList(list) {
    const newList = {
      id: crypto.randomUUID(),
      name: list,
      createdAt: Date.now(),
      tasksArr: [],
    };
    setLists(() => [...lists, newList]);
  }

  function handleDeletingList(id) {
    setLists((lists) => lists.filter((list) => list.id !== id));
    setActiveList(null);
  }

  return (
    <div className="App">
      <NavBar
        handleAddingList={handleAddingList}
        lists={lists}
        handleDeletingList={handleDeletingList}
        activeList={activeList}
        setActiveList={setActiveList}
      />
      <Main
        handleSubmit={handleSubmit}
        handleCompleteTask={handleCompleteTask}
        handleRemovingTask={handleRemovingTask}
        tasks={activeList ? activeList.tasksArr : []}
      />
      <Actions />
    </div>
  );
}

function NavBar({
  handleAddingList,
  lists,
  handleDeletingList,
  activeList,
  setActiveList,
}) {
  const [open, setOpen] = useState(true);
  const [list, setList] = useState("");

  function onSubmitList(e) {
    e.preventDefault();
    handleAddingList(list);
    setList("");
    setOpen(false);
  }

  return (
    <nav className="nav-bar">
      <Logo />
      <div className="center">
        <button
          onClick={() => setOpen(!open)}
          className={`add-list ${open && "active"}`}
        >
          +
        </button>
      </div>
      {open && (
        <form onSubmit={(e) => onSubmitList(e)} className="form-list">
          <input
            value={list}
            onChange={(e) => setList(e.target.value)}
            type="text"
            placeholder="Enter list name..."
          />
          <button type="submit">X</button>
        </form>
      )}
      <NavList
        lists={lists}
        handleDeletingList={handleDeletingList}
        setActiveList={setActiveList}
        activeList={activeList}
      />
    </nav>
  );
}

function Logo() {
  return <img src="logoNav.png" alt="App logo"></img>;
}

function NavList({ lists, handleDeletingList, setActiveList, activeList }) {
  return (
    <div className="nav-list-container">
      <h3>My Lists:</h3>
      <ul className="nav-list">
        {lists.map((list, i) => (
          <NavListItem
            setActiveList={setActiveList}
            handleDeletingList={handleDeletingList}
            lists={list}
            isActive={activeList && activeList.id === list.id}
            key={list.id}
          />
        ))}
      </ul>
    </div>
  );
}

function NavListItem({ isActive, lists, handleDeletingList, setActiveList }) {
  return (
    <li className={`nav-list-item ${isActive ? "active" : ""}`}>
      <button onClick={() => setActiveList(lists)}>{lists.name}</button>
      {isActive ? <p onClick={() => handleDeletingList(lists.id)}>X</p> : ""}
    </li>
  );
}

// MAIN PAGE

function Main({ handleSubmit, handleCompleteTask, handleRemovingTask, tasks }) {
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

function TaskList({ handleCompleteTask, handleRemovingTask, tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task, i) => (
        <TaskListItem
          task={task}
          key={task.id}
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
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));

  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function previousMonth() {
    let firstDayPreviousMonth = sub(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  }

  return (
    <div className="actions">
      <CalendarDate
        today={today}
        nextMonth={nextMonth}
        firstDayCurrentMonth={firstDayCurrentMonth}
        previousMonth={previousMonth}
      />
      <Calendar
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        firstDayCurrentMonth={firstDayCurrentMonth}
      />
    </div>
  );
}
function CalendarDate({ nextMonth, firstDayCurrentMonth, previousMonth }) {
  return (
    <div className="calendar-date">
      <span className="calendar-month-year">
        {format(firstDayCurrentMonth, "MMM yyyy")}
      </span>
      <button className="calendar-button--left">
        <FaCaretLeft onClick={previousMonth} />
      </button>
      <button className="calendar-button--right">
        <FaCaretRight onClick={nextMonth} />
      </button>
    </div>
  );
}

function Calendar({ firstDayCurrentMonth, selectedDay, setSelectedDay }) {
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  return (
    <>
      <div className="calendar-weekdays">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>
      <div className="calendar">
        {days.map((day, i) => (
          <CalendarDay
            day={day}
            key={i}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            className={i === 0 && colStartClasses[getDay(day)]}
          />
        ))}
      </div>
    </>
  );
}

function CalendarDay({ day, selectedDay, setSelectedDay, className }) {
  console.log(className);
  return (
    <button
      onClick={() => setSelectedDay(day)}
      className={
        isEqual(day, selectedDay)
          ? "calendar-day active"
          : `${className} calendar-day`
      }
    >
      {format(day, "d")}
    </button>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
