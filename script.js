const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display saved tasks
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task}</span>
      <div>
        <button class="edit" onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Add Task
addBtn.addEventListener("click", () => {
  const newTask = taskInput.value.trim();
  if (newTask === "") return alert("Please enter a task!");
  tasks.push(newTask);
  taskInput.value = "";
  saveAndDisplay();
});

// Edit Task
function editTask(index) {
  const newTask = prompt("Edit your task:", tasks[index]);
  if (newTask !== null && newTask.trim() !== "") {
    tasks[index] = newTask.trim();
    saveAndDisplay();
  }
}

// Delete Task
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveAndDisplay();
  }
}

// Save to localStorage
function saveAndDisplay() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

displayTasks();
