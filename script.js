// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  
  // Load saved tasks
  loadTasks();

  // Handle form submission
  taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskInput = document.getElementById('task');
      addTask(taskInput.value);
      taskInput.value = ''; // Clear input
  });

  function addTask(taskText) {
      if (!taskText) return;

      const li = document.createElement('li');
      li.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-md';
      
      li.innerHTML = `
          <div class="flex items-center gap-3">
              <input type="checkbox" class="task-checkbox w-4 h-4">
              <span class="task-text">${taskText}</span>
          </div>
          <div class="flex gap-2">
              <button class="edit-btn text-blue-500 hover:text-blue-700">
                  Edit
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700">
                  Delete
              </button>
          </div>
      `;

      // Add event listeners
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => toggleTask(li));

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteTask(li));

      const editBtn = li.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => editTask(li));

      taskList.appendChild(li);
      saveTasks();
  }

  function toggleTask(li) {
      const taskText = li.querySelector('.task-text');
      taskText.classList.toggle('line-through');
      saveTasks();
  }

  function deleteTask(li) {
      li.remove();
      saveTasks();
  }

  function editTask(li) {
      const taskText = li.querySelector('.task-text');
      const newText = prompt('Edit task:', taskText.textContent);
      
      if (newText !== null && newText.trim() !== '') {
          taskText.textContent = newText;
          saveTasks();
      }
  }

  function saveTasks() {
      const tasks = [];
      document.querySelectorAll('#taskList li').forEach(li => {
          tasks.push({
              text: li.querySelector('.task-text').textContent,
              completed: li.querySelector('.task-checkbox').checked
          });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => {
          addTask(task.text);
          if (task.completed) {
              const lastTask = taskList.lastElementChild;
              const checkbox = lastTask.querySelector('.task-checkbox');
              checkbox.checked = true;
              toggleTask(lastTask);
          }
      });
  }
});