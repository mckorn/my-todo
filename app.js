// Initialize the to-do list from local storage or create an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];

// DOM elements
const todoList = document.getElementById("taskList");
const timerInput = document.getElementById("timerInput");
const addTaskButton = document.getElementById("addTask"); //new
const taskCount = document.getElementById("count"); //new

const openPopupBtn = document.getElementById("openPopup"); //new
const popup = document.getElementById("popup"); //new
const closePopupBtn = document.getElementById("closeBtn"); //new
const addTaskBtn = document.getElementById("addTaskPopup"); //new
const taskInput = document.getElementById("task"); // new
const hoursInput = document.getElementById("hours"); //new
const minutesInput = document.getElementById("minutes"); //new
const secondsInput = document.getElementById("seconds"); //new

const date = document.getElementById("date");

// initialize app
document.addEventListener("DOMContentLoaded", function () {
  displayTasks(); // display any existing tasks

  // display the current date
  const currentDate = new Date();
  const options = { weekday: "short", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  date.textContent = formattedDate;

  // open the popup when the add task button is clicked
  openPopupBtn.addEventListener("click", function () {
    popup.style.display = "block";
  });

  // close the popup when the close button is clicked
  closePopupBtn.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // add task from popup
  addTaskBtn.addEventListener("click", function () {
    addTask();
    popup.style.display = "none";
  });
});

// TODO next is  make the name pop up in the current activity
//when a checkbox is clicked it will run the time and then add it to the done list
document.addEventListener("change", function (event) {
  console.log("hit");
  if (event.target.classList.contains(".todo-checkbox")) {
    const allCheckboxes = document.querySelectorAll(".todo-checkbox");
    const checkedContent = document.getElementById("selected-item");
    if (event.target.checked) {
      const index = event.target.id.split("-")[1];
      const element = todo[index];
      // disable all other checkboxes to prevent overlap
      allCheckboxes.forEach((checkbox) => {
        if (checkbox !== event.target) {
          checkbox.disabled = true;
        }
      });
      checkedContent.innerText = element.task + " " + element.time;
      setTimeout(() => {
        displayTime(element.time, checkedContent, () => {
          completeTask(element.task, element.time, index);
        });
        // Call any other functions or perform additional actions here
      }, 1000); // 1000 milliseconds = 1 second
    } else {
      checkedContent.textContent = " ";
      allCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
      });
    }
  } else {
    console.log("not hit");
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
    taskInput.value = "";
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    // update the UI
    displayTasks();
  } else {
    console.log(taskText, taskTime);
    alert("Enter a valid task and timer.");
  }
}

// TODO Increase efficiency later
function displayTasks() {
  todoList.innerHTML = ""; // Clear the list

  todo.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-container");

    // create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = item.disabled;
    checkbox.addEventListener("change", function () {
      toggleTask(index);
    });

    // create task text element
    const taskSpan = document.createElement("span");
    taskSpan.classList.add("task");
    taskSpan.innerText = item.task;

    // create time text element
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.innerText = `${item.time} seconds`;

    // append elements to the <li> element
    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(timeSpan);

    // append the <li> element to the todoList
    todoList.appendChild(li);
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
  localStorage.setItem("todo", JSON.stringify(todo));
}

// THIS IS ALL YOUR OLD CODE
// // retrieve todo from local storage or initialize an empty array

// // todo = to the local storage, if that dosen't exist them make an empty array
// let todo = JSON.parse(localStorage.getItem("todo")) || [];
// let done = JSON.parse(localStorage.getItem("done")) || [];

// const todoInput = document.getElementById("taskInput");
// const timerInput = document.getElementById("timerInput");
// const todoCount = document.getElementById("todoCount");
// const todoList = document.getElementById("taskList");
// const doneList = document.getElementById("completedList");

// // const t = document.getElementById("task");
// // const h = document.getElementById("hours");
// // const m = document.getElementById("minutes");
// // const s = document.getElementById("seconds");

// const addButton = document.querySelector(".btn");
// const deleteButton = document.getElementById("deleteBttn");

// // initialize
// document.addEventListener("DOMContentLoaded", function () {
//   // when something happens the function will run
//   const addTaskBtn = document.getElementById("addTask");
//   const popup = document.getElementById("popup");
//   const closeButton = document.querySelector(".close");

//   addTaskBtn.addEventListener("click", function () {
//     popup.style.display = "block"; // Show the popup
//   });

//   closeButton.addEventListener("click", function () {
//     popup.style.display = "none"; // Hide the popup
//   });

//   // addButton.addEventListener("click", addTask);

//   //   todoInput.addEventListener('keydown', function (event) {
//   //     if (event.key === "Enter") {
//   //       event.preventDefault(); // basically means, don't refresh the page (or empty the input or send to another page)
//   //       console.log('test');
//   //         addTask(); // actually I'm not really sure what this does
//   //     }
//   //   });
//   //   deleteButton.addEventListener("click", deleteAllTasks);
//   displayTasks();
//   displayCompletedTasks();
// });

// // when a checkbox is clicked it will run the time and then add it to the done list
// // document.addEventListener('change', function (event) {
// //     console.log('hit');
// //     if (event.target.classList.contains('.todo-checkbox')) {
// //         const allCheckboxes = document.querySelectorAll('.todo-checkbox');
// //         const checkedContent = document.getElementById("selected-item");
// //         if (event.target.checked) {
// //             const index = event.target.id.split("-")[1];
// //             const element = todo[index];
// //             // disable all other checkboxes to prevent overlap
// //             allCheckboxes.forEach(checkbox => {
// //                 if (checkbox !== event.target) {
// //                     checkbox.disabled = true;
// //                 }
// //             });
// //             checkedContent.innerText = element.task + " " + element.time;
// //             setTimeout(() => {
// //                 displayTime(element.time, checkedContent, () => {
// //                     completeTask(element.task, element.time, index);
// //                 });
// //                 // Call any other functions or perform additional actions here
// //             }, 1000); // 1000 milliseconds = 1 second
// //         } else {
// //             checkedContent.textContent = " ";
// //             allCheckboxes.forEach(checkbox => {
// //                 checkbox.disabled = false;
// //             });
// //         }
// //     } else {
// //         console.log('not hit');
// //     }
// // });

// function displayTime(timer, display, callback) {
//   let countDown = setInterval(function () {
//     minutes = parseInt(timer / 60, 10);
//     seconds = parseInt(timer % 60, 10);

//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     display.textContent = minutes + " : " + seconds;
//     if (timer < 0) {
//       clearInterval(countDown);
//       display.textContent = "all done!";
//       if (callback) {
//         callback();
//       }
//       // or reset the timer with
//       // timer = time
//     }
//     timer--;
//   }, 1000);
//   return true;
// }

// function addTask() {
//   // const also means you can't access the values outside of this function
//   const tasker = taskInput.value.trim();
//   const timer = parseInt(timerInput.value);

//   if (tasker !== "" && !isNaN(timer)) {
//     todo.push({
//       // want to use it as an object (so we can include components)
//       task: tasker,
//       time: timer,
//       disabled: false,
//       // we have just randomly created these variable values
//     });
//     saveToLocalStorage("todo");
//     // then clear the text after you press enter
//     todoInput.value = "";
//     timerInput.value = "";
//     displayTasks();
//   } else {
//     alert("Enter a valid task and timer.");
//     return;
//   }

//   // if (!task || isNaN(timer)) { // POSSIBLY SHOULD USE newTask !== ""
//   //   alert('Enter a valid task and timer.')
//   //   return;
//   // }
// }

// function completeTask(task, time, element) {
//   // TODO allow users to save the amount of time it actually took them (instead of the expected time)
//   const finishedTask = document.createElement("li");
//   finishedTask.innerText = task + " " + time;
//   done.push({
//     // want to use it as an object (so we can include components)
//     task: task,
//     time: time,
//   });

//   saveToLocalStorage("done");

//   // remove the task element from the current list
//   todo.splice(element, 1);
//   saveToLocalStorage("todo");

//   displayCompletedTasks();
//   displayTasks();
// }

// function deleteAllTasks() {
//   todo = []; // Clear the todo array
//   saveToLocalStorage("todo"); // Update local storage with empty array
//   displayTasks(); // Update the UI to reflect the changes
// }

// function displayCompletedTasks() {
//   doneList.innerHTML = "";
//   done.forEach((item, index) => {
//     const p = document.createElement("p");
//     p.innerHTML = `
//         <div class="todo-container">
//         <span style="color: white;"> ${index + 1}. &nbsp</span>
//         <span id="done-${index}" class="task">${item.task}
//         </span>
//         </div>
//       `;
//     doneList.appendChild(p);
//   });
//   updateTaskCount();
// }

// // function displayCompletedTasks() {
// //     // doneList.innerHTML = "";
// //     const complete = document.getElementById("completedList");
// //     complete.innerHTML = ""; // clear the list to give the most up to date list

// //     done.forEach((item, index) => {
// //         const li = document.createElement("li");
// //         li.textContent = `${item.text} (${item.time})`;
// //         completedList.appendChild(li);
// //     });
// //     updateTaskCount();
// // }

// document.getElementById("setTimer").addEventListener("click", function () {
//   // Get the values from the input fields
//   let task = document.getElementById("task").value;
//   let hours = document.getElementById("hours").value || 0;
//   let minutes = document.getElementById("minutes").value || 0;
//   let seconds = document.getElementById("seconds").value || 0;

//   // Format the time and set it to the input box
//   // let formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
//   let formattedTime = `${hours}:${minutes}:${seconds}`;
//   // document.getElementById("countdown").value = formattedTime;
//   console.log("formattedTime:" + formattedTime); // Log the formatted time to the console
//   console.log("task:" + task);

//   // Hide the popup
//   document.getElementById("popup").style.display = "none";

//   // add task
//   if (task !== "") {
//     todo.push({
//       // want to use it as an object (so we can include components)
//       task: task,
//       time: seconds,
//       disabled: false,
//       // we have just randomly created these variable values
//     });
//     saveToLocalStorage("todo");
//     // then clear the text after you press enter
//     // todoInput.value = "";
//     // timerInput.value = "";
//     displayTasks();
//   } else {
//     alert("Enter a valid task and timer.");
//     return;
//   }
// });
