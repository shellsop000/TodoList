// Wait for DOM to load before executing code
document.addEventListener("DOMContentLoaded", () => {
    // Get references to important DOM elements
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
  
    // Initialize by loading any previously saved tasks from localStorage
    loadTasks();
  
    // Set up form submission handler
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission
      const taskInput = document.getElementById("task");
      addTask(taskInput.value);
      taskInput.value = ""; // Clear input field after adding task
    });
  
    /**
     * Creates and adds a new task item to the list
     */
    function addTask(taskText) {
      if (!taskText) return; // Don't create empty tasks
  
      // Create new list item with Tailwind CSS classes
      const li = document.createElement("li");
      li.className = "flex items-center justify-between p-3 bg-gray-50 rounded-md";
  
      // Create the HTML structure for the task item
      li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" class="task-checkbox w-4 h-4">
                <span class="task-text">${taskText}</span>
            </div>
            <div class="flex gap-2">
                <button type="button" class="edit-btn btn btn-secondary">
                    Edit
                </button>
                <button type="button" class="delete-btn btn btn-danger">
                    Delete
                </button>
            </div>
        `;
  
      // Set up event listeners for task interactions
      const checkbox = li.querySelector(".task-checkbox");
      checkbox.addEventListener("change", () => toggleTask(li)); // Handle task completion
  
      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteTask(li)); // Handle task deletion
  
      const editBtn = li.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => editTask(li)); // Handle task editing
  
      // Add task to DOM and save to localStorage
      taskList.appendChild(li);
      saveTasks();
    }
  
    /**
     * Toggles the completion state of a task
     */
    function toggleTask(li) {
      const taskText = li.querySelector(".task-text");
      taskText.classList.toggle("line-through"); // Add/remove strikethrough
      saveTasks(); // Persist changes
    }
  
    /**
     * Removes a task from the list
     */
    function deleteTask(li) {
      li.remove(); // Remove from DOM
      saveTasks(); // Update localStorage
    }
  
    /**
     * Enables editing of a task's text content
     */
    function editTask(li) {
      const taskText = li.querySelector(".task-text");
      const newText = prompt("Edit task:", taskText.textContent);
  
      // Update task text if user didn't cancel and provided non-empty text
      if (newText !== null && newText.trim() !== "") {
        taskText.textContent = newText;
        saveTasks(); // Persist changes
      }
    }
  
    /**
     * Saves all tasks to localStorage
     */
    function saveTasks() {
      const tasks = [];
      // Collect all tasks and their states
      document.querySelectorAll("#taskList li").forEach((li) => {
        tasks.push({
          text: li.querySelector(".task-text").textContent,
          completed: li.querySelector(".task-checkbox").checked,
        });
      });
      // Save to localStorage as JSON string
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    /**
     * Loads tasks from localStorage and renders them
     */
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      // Recreate each saved task
      tasks.forEach((task) => {
        addTask(task.text);
        if (task.completed) {
          const lastTask = taskList.lastElementChild;
          const checkbox = lastTask.querySelector(".task-checkbox");
          checkbox.checked = true;
          toggleTask(lastTask); // Apply completed state
        }
      });
    }
  });