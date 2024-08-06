function addTask() {
  const taskInput = document.getElementById('task-input');
  const timerInput = document.getElementById('timer-input');
  const taskList = document.getElementById('task-list');

  const task = taskInput.value;
  const timer = parseInt(timerInput.value);

  if (!task || isNaN(timer)) {
    alert('Enter a valid task and timer.')
    return;
  }

  const listItem = ocument.createElement('li');
  listItem.textContent = '${task} - ${timer} seconds';

  taskList.appendChild(listItem);

  setTimeout(() => {
    alert('Time iz up for: ${task}')
    taskList.removeChild(listItem);
  }, timer * 1000);

  taskInput.value = '';
  timerInput.value = '';
}
