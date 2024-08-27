// retrieve todo from local storage or initialize an empty array

// todo = to the local storage, if that dosen't exist them make an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
let done = JSON.parse(localStorage.getItem("done")) || [];

const todoInput = document.getElementById('taskInput');
const timerInput = document.getElementById('timerInput');
const todoCount = document.getElementById('todoCount');
const todoList = document.getElementById('taskList');
const doneList = document.getElementById('completedList');

const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteBttn")

// initialize
document.addEventListener("DOMContentLoaded", function() { // when something happens the function will run
    const setCountdownButton = document.getElementById('setCountdown');
  const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close');
    
    setCountdownButton.addEventListener('click', function() {
        popup.style.display = 'block'; // Show the popup
      });
    
      closeButton.addEventListener('click', function() {
        popup.style.display = 'none'; // Hide the popup
      });
    
    addButton.addEventListener("click", addTask);

  todoInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // basically means, don't refresh the page (or empty the input or send to another page)
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
    displayCompletedTasks();
});

// when a checkbox is clicked it will run the time and then add it to the done list
document.addEventListener('change', function (event) {
    if (event.target.classList.contains('todo-checkbox')) {
        const allCheckboxes = document.querySelectorAll('.todo-checkbox');
        const checkedContent = document.getElementById("selected-item");
        if (event.target.checked) {
            const index = event.target.id.split("-")[1];
            const element = todo[index]; 
            // disable all other checkboxes to prevent overlap
            allCheckboxes.forEach(checkbox => {
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
            allCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    }
});

function displayTime(timer, display, callback) {

    let countDown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + " : " + seconds;
        if (timer < 0) {
            clearInterval(countDown);
            display.textContent = "all done!";
            if (callback) {
                callback();
            }
            // or reset the timer with
            // timer = time
        }  
        timer--;
    }, 1000);
    return true;
}

function addTask() {
  // const also means you can't access the values outside of this function
  const tasker = taskInput.value.trim();
  const timer = parseInt(timerInput.value);

  if (tasker !== "" && !(isNaN(timer)) ) {
    todo.push({ // want to use it as an object (so we can include components)
      task: tasker, 
      time: timer,
      disabled: false,
      // we have just randomly created these variable values
    });
    saveToLocalStorage("todo");
    // then clear the text after you press enter
    todoInput.value = "";
    timerInput.value = "";
    displayTasks();
  } else {
    alert('Enter a valid task and timer.')
    return;
  }

  // if (!task || isNaN(timer)) { // POSSIBLY SHOULD USE newTask !== ""
  //   alert('Enter a valid task and timer.')
  //   return;
  // }
}


function completeTask(task, time, element) { 
    // TODO allow users to save the amount of time it actually took them (instead of the expected time)
    const finishedTask = document.createElement("li");
    finishedTask.innerText = task + " " + time;
    done.push({ // want to use it as an object (so we can include components)
        task: task, 
        time: time,
    });

    saveToLocalStorage("done");

    // remove the task element from the current list
    todo.splice(element, 1);
    saveToLocalStorage("todo");

    displayCompletedTasks();
    displayTasks();
}

function deleteAllTasks() {
    todo = []; // Clear the todo array
    saveToLocalStorage("todo"); // Update local storage with empty array
    displayTasks(); // Update the UI to reflect the changes
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    // below is how we define that we are writing in html
    // you'll see that we make the id the input-index of the list and 
    // if the item is disabled then we make it checked
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" 
        id="input-${index}" 
        ${item.disabled ? "checked" : ""}>
      <span id="todo-${index}" class="task">${item.task}
      </span>
      <span class ="time">${item.time} seconds</span>
      </div>
    `
      todoList.appendChild(p);
  });
  updateTaskCount();
}

function displayCompletedTasks() {
    doneList.innerHTML = "";
    done.forEach((item, index) => {
      const p = document.createElement("p");
      p.innerHTML = `
        <div class="todo-container">
        <span id="done-${index}" class="task">${item.task}
        </span>
        </div>
      `
      doneList.appendChild(p);
    });
    updateTaskCount();
  }

// function displayCompletedTasks() {
//     // doneList.innerHTML = "";
//     const complete = document.getElementById("completedList");
//     complete.innerHTML = ""; // clear the list to give the most up to date list

//     done.forEach((item, index) => {
//         const li = document.createElement("li");
//         li.textContent = `${item.text} (${item.time})`;
//         completedList.appendChild(li);
//     });
//     updateTaskCount();
// }

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage("todo");
  displayTasks();
}

function updateTaskCount() {
    //todoCount.innerText = todo.filter(item => !item.disabled).length;
    const taskCount = document.getElementById("count");
    taskCount.innerText = todo.length;
}

function saveToLocalStorage(fileName) {
  // this item is going to be called a todo or done
  localStorage.setItem(fileName, JSON.stringify(fileName === "todo" ? todo : done));
}

document.getElementById("countdown").addEventListener("click", function() {
    // Show the popup
    document.getElementById("popup").style.display = "block";
});

document.querySelector(".close").addEventListener("click", function() {
    // Hide the popup
    document.getElementById("popup").style.display = "none";
});

document.getElementById("setTimer").addEventListener("click", function() {
    // Get the values from the input fields
    let hours = document.getElementById("hours").value || 0;
    let minutes = document.getElementById("minutes").value || 0;
    let seconds = document.getElementById("seconds").value || 0;

    // Format the time and set it to the input box
    let formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    document.getElementById("countdown").value = formattedTime;

    // Hide the popup
    document.getElementById("popup").style.display = "none";
});