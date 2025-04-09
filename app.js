// Initialize the to-do list from local storage or create an empty array
let todo = JSON.parse(localStorage.getItem('todo')) || [];
let done = JSON.parse(localStorage.getItem('done')) || [];

let selectedTaskIndex = null;

let countDown; // to store the timer interval (so we can stop it later)

// DOM elements
const todoList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const timerInput = document.getElementById('timerInput');
const addTaskButton = document.getElementById('addTask');
const taskCount = document.getElementById('count');

const openPopupBtn = document.getElementById('openPopupBtn');
const addTaskPopup = document.getElementById('addTaskPopup');
const closePopupBtn = document.getElementById('closeBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('task');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

const startTaskBtn = document.getElementById('startTaskBtn');
const startTaskPopup = document.getElementById('startTaskPopup');
const finishTBtn = document.getElementById('finishTBtn');
const startTaskText = document.getElementById('selected-task');
const startTaskTime = document.getElementById('task-time');

const finishTaskBtn = document.getElementById('finishTaskBtn');

const date = document.getElementById('date');

// initialize app
document.addEventListener('DOMContentLoaded', function () {
  displayTasks(); // display any existing tasks

  // display the current date
  const currentDate = new Date();
  const options = { weekday: 'short', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  date.textContent = formattedDate;

  // display all current tasks
  displayTasks();
  displayCompletedTasks();

  // open the popup when the add task button is clicked
  openPopupBtn.addEventListener('click', function () {
    addTaskPopup.style.display = 'block';
  });

  // add task from popup
  addTaskBtn.addEventListener('click', function () {
    addTask();
    addTaskPopup.style.display = 'none';
  });

  // start task
  startTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== null) {
      startTaskPopup.style.display = 'block';
      startTask(selectedTaskIndex);
      // selectedTaskIndex = null;
      // document.getElementById('selected-item').textContent = 'No task selected';
    } else {
      alert('No task selected');
    }
  });

  // complete task
  finishTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== null) {
      completeTask(selectedTaskIndex);
      // selectedTaskIndex = null;
      // document.getElementById('selected-item').textContent = 'No task selected';
    } else {
      alert('No task selected');
    }
  });
});

// close the popup when 'x' is clicked
document.addEventListener('click', function (event) {
  // check if the clicked element has the close class in it
  if (event.target.classList.contains('close')) {
    // find the parent element and hide the popup
    const parentPopup = event.target.closest('.popup');
    if (parentPopup) parentPopup.style.display = 'none';
  }
});

// todo list checkboxes
document.addEventListener('click', function (event) {
  const allCheckboxes = document.querySelectorAll('todo-checkbox');
  const selectedTask = document.getElementById('selected-item');

  // check if event target is a checkboxd with the "todo-checkbox" class
  if (event.target.classList.contains('todo-checkbox')) {
    const index = parseInt(event.target.dataset.index, 10); //const index = event.target.id.split("-")[1];

    if (event.target.checked) {
      selectedTaskIndex = index; // store the index of the selected task globally
      const task = todo[index];

      // display the selected task in the current activity
      selectedTask.textContent = task.task; //`${task.task} (${task.time} seconds)`;

      // disable all other checkboxes to prevent overlap
      allCheckboxes.forEach((checkbox) => {
        if (checkbox !== event.target) {
          checkbox.disabled = true;
        }
      });

      // start the timer for the selected task
      // displayTime(task.time, selectedTask, () => {
      //   // completeTask(element.task, element.time, index);
      //   // Call any other functions or perform additional actions here
      // });

      // setTimeout(() => {
      //   displayTime(element.time, checkedContent, () => {
      //     completeTask(element.task, element.time, index);
      //   });
      //   // Call any other functions or perform additional actions here
      // }, 1000); // 1000 milliseconds = 1 second
    } else {
      selectedTaskIndex = null; // clear the selected task index
      selectedTask.textContent = 'No task selected';
      // allCheckboxes.forEach((checkbox) => {
      //   checkbox.disabled = false;
      // });
    }
  } else {
    console.log('not hit');
    selectedTask.textContent = 'No task yet :(';
  }
});

function addTask() {
  const taskText = taskInput.value.trim();
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  // Convert time to total seconds
  const taskTime = hours * 3600 + minutes * 60 + seconds;

  //const taskTime = parseInt(timerInput.value); //(timerInput.value.trim(), 10);

  if (taskText && !isNaN(taskTime)) {
    // add the task to the todo list
    todo.push({
      task: taskText,
      time: taskTime,
      disabled: false,
    });

    saveToLocalStorage();

    // clear the input fields
    taskInput.value = '';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';

    // update the UI
    displayTasks();
  } else {
    console.log(taskText, taskTime);
    alert('Enter a valid task and timer.');
  }
}

function startTask(index) {
  // display task and time in popup
  const task = todo[index];

  startTaskText.innerHTML = task.task;
  startTaskTime.innerHTML = formatTime(task.time);

  // event listener for starting timer
  finishTBtn.addEventListener('click', function handleS() {
    // hide the popup
    startTaskPopup.style.display = 'none';

    // start the timer
    displayTimeInPopup(task.time, task.task, function () {
      console.log('everything went swimmingly *fingers crossed*');
      // completeTask(index); // complete the task after time is up
    });

    // Remove the event listener after it's used to prevent duplicate listeners
    finishTBtn.removeEventListener('click', handleS);
  });
}

function completeTask(index) {
  const finishedTask = todo.splice(index, 1)[0]; // remove the task from the todo list (and get it)
  done.push(finishedTask); // add the task to the done list

  saveToLocalStorage(); // save the updated todo and done lists

  displayTasks(); // update the UI
  displayCompletedTasks(); // update the UI
}

// TODO Increase efficiency later
function displayTasks() {
  todoList.innerHTML = ''; // Clear the list

  todo.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('todo-container');

    // create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-checkbox');
    checkbox.dataset.index = index; // stores the index of the task in the dataset
    checkbox.checked = item.disabled;
    // checkbox.addEventListener("change", function () {
    //   toggleTask(index);
    // });

    // create task text element
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task');
    taskSpan.innerText = item.task;

    // create time text element
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time');
    timeSpan.innerText = `${item.time} sec`;

    // append elements to the <li> element
    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(timeSpan);

    // append the <li> element to the todoList
    todoList.appendChild(li);
  });

  updateTaskCount();
}

function displayCompletedTasks() {
  const completedContainer = document.querySelector('.to-done-list'); // Select the container
  completedList.innerHTML = ''; // Clear the completed list

  done.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('completed-container');

    // create task text element
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task');
    taskSpan.innerText = item.task;

    // create time text element
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time');
    timeSpan.innerText = `${item.time} sec`;

    // append elements to the <li> element
    li.appendChild(taskSpan);
    li.appendChild(timeSpan);

    // append the <li> element to the todoList
    completedList.appendChild(li);
  });

  updateTaskCount();
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled; // toggle the disabled property
  saveToLocalStorage(); // save the updated todo list
  displayTasks(); // update the UI
}

function updateTaskCount() {
  taskCount.innerText = todo.length;
}

function saveToLocalStorage() {
  // save the todo array to local storage
  localStorage.setItem('todo', JSON.stringify(todo));
  localStorage.setItem('done', JSON.stringify(done));
}

// format the time for display
function formatTime(totalSec) {
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return `${hours}:${minutes}:${seconds}`;
}

// displays the time and counts it down
function displayTimeInPopup(time, task, callback) {
  const timerPopup = document.getElementById('timerPopup');
  const taskName = document.getElementById('taskName');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const stopTimerBtn = document.getElementById('stopTimerBtn');
  const finishTimerBtn = document.getElementById('finishTimerBtn');
  const pauseTimerBtn = document.getElementById('pauseTimerBtn');
  const timerDisplay = document.getElementById('timerDisplay');

  // set the task name and display the popup
  timerPopup.style.display = 'block';
  taskName.innerText = `${task}`;

  // clear any existing timers
  clearInterval(countDown);

  // start the timer
  let timer = time;

  countDown = setInterval(function () {
    const hours = Math.floor(timer / 3600); //parseInt(timer / 3600, 10);
    const minutes = Math.floor(timer / 60) % 60; //parseInt(timer / 60, 10);
    const seconds = timer % 60; //parseInt(timer % 60, 10);

    // TODO implement hours and test when going from 1 hours to 59 minutes
    // Format the time as MM:SS
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    // old code ---~v
    // minutes = minutes < 10 ? '0' + minutes : minutes;
    // seconds = seconds < 10 ? '0' + seconds : seconds;
    // display.textContent = minutes + ' : ' + seconds;

    if (timer <= 0) {
      clearInterval(countDown);
      display.textContent = 'all done!';
      if (callback) callback();
    }
    timer--;
  }, 1000);

  stopTimerBtn.addEventListener('click', function () {
    clearInterval(countDown); // stop the timer
    timerPopup.style.display = 'none'; // hide the popup
  });

  finishTimerBtn.addEventListener('click', function () {
    clearInterval(countDown); // stop the timer
    timerPopup.style.display = 'none'; // hide the popup
    completeTask(selectedTaskIndex); // complete the task
  });
}
