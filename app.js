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
  console.log("test");

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

      <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}"
         onclick="editTask(${index})">${item.text}
      </p>
      </div>
    `
    p.querySelector(".todo-checkbox").addEventListener
    ("change", () => {
      toggleTask(index);
    });
    todoList.appendChild(p);
  });
}

function saveToLocalStorage() {
  // this item is going to be called a todo
  localStorage.setItem("todo", JSON.stringify(todo));
}