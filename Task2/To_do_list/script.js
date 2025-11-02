const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");
const addBtn = document.getElementById("addBtn");

// Add task
addBtn.addEventListener("click", () => {
  let text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task");
    return;
  }

  let li = document.createElement("li");

  // Task text
  let span = document.createElement("span");
  span.textContent = text;

  // Checkbox for completion
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    updateStats();
  });

  // 🗑️ Delete button
  let delBtn = document.createElement("span");
  delBtn.textContent = "🗑️";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    li.remove();
    updateStats();
  });

  // Order: text, checkbox, trash
  li.appendChild(span);
  li.appendChild(checkbox);
  li.appendChild(delBtn);

  taskList.appendChild(li);
  taskInput.value = "";
  updateStats();
});

// Update counts
function updateStats() {
  const total = taskList.children.length;
  const completed = taskList.querySelectorAll(".completed").length;
  const pending = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}
updateStats();


