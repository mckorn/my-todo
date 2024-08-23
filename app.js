// retrieve todo from local storage or initialize an empty array

// todo = to the local storage, if that dosen't exist them make an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById('taskInput');
const timerInput = document.getElementById('timerInput');
const todoCount = document.getElementById('todoCount');
const todoList = document.getElementById('taskList');

const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteBttn")

// initialize
document.addEventListener("DOMContentLoaded", function() { // when something happens the function will run
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // basically means, don't refresh the page (or empty the input or send to another page)
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

document.addEventListener('change', function (event) {
    if (event.target.classList.contains('todo-checkbox')) {
        const checkedContent = document.getElementById("selected-item");
        const checkedTask = event.target.parentElement.querySelector('.task').innerText;
        const checkedTime = event.target.parentElement.querySelector('.time').innerText;
        if (event.target.checked) {
            checkedContent.innerText = checkedTask + " " + checkedTime;
            displayTime(checkedTime, checkedContent);
        } else {
            checkedContent.textContent = " ";
        }
    }
});

function displayTime(time, display) {
    let timer = time.split(" ")[0];
    console.log(timer);
    
    let countDown = setInterval(function () {
        timer--;
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = timer + " : " + "00";
        if (timer === 0) {
            clearInterval(countDown);
            display.textContent = " ";
            // or reset the timer with
            // timer = time
        }  
    }, 1000);
}

function addTask() {
  // const also means you can't access the values outside of this function
  const task = taskInput.value.trim();
  const timer = parseInt(timerInput.value);

  if (task !== "" && !(isNaN(timer)) ) {
    todo.push({ // want to use it as an object (so we can include components)
      text: task, 
      time: timer,
      disabled: false,
      // we have just randomly created these variable values
    });
    saveToLocalStorage();
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

function deleteAllTasks() {
    todo = []; // Clear the todo array
    saveToLocalStorage(); // Update local storage with empty array
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
      <span id="todo-${index}" class="task"
         onclick="editTask(${index})">${item.text}
      </span>
      <span class ="time">${item.time} minutes</span>
      </div>
    `
    // p.querySelector(".todo-checkbox").addEventListener
    // ("change", () => {
    //   toggleTask(index);
    // });
      todoList.appendChild(p);
  });
  updateTaskCount();
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function updateTaskCount() {
    // todoCount.innerText = todo.filter(item => !item.disabled).length;
    const taskCount = document.getElementById("count");
    taskCount.innerText = todo.length;
}

function saveToLocalStorage() {
  // this item is going to be called a todo
  localStorage.setItem("todo", JSON.stringify(todo));
}