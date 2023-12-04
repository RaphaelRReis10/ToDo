// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

const updateTotalCount = () => {
  const todos = document.querySelectorAll(".todo");
  const totalCount = todos.length;

  document.getElementById("totais").innerText = totalCount;
};

const updateDoneCount = () => {
  const doneTodos = document.querySelectorAll(".todo:not(.done)");
  const doneCount = doneTodos.length;

  document.getElementById("abertas").innerText = doneCount;
};

const updateOpenCount = () => {
  const openTodos = document.querySelectorAll(".todo.done");
  const openCount = openTodos.length;

  document.getElementById("feitas").innerText = openCount;
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
    updateTotalCount();
    updateDoneCount();
    updateOpenCount();
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
    updateTotalCount(); // Atualiza o total ao adicionar uma nova tarefa
    updateDoneCount(); // Atualiza as tarefas concluídas ao adicionar uma nova tarefa
    updateOpenCount();
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
    updateTotalCount(); // Atualiza o total ao adicionar uma nova tarefa
    updateDoneCount(); // Atualiza as tarefas concluídas ao adicionar uma nova tarefa
    updateOpenCount();
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    updateTotalCount();
    updateDoneCount();
    updateOpenCount();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Adiciona a classe 'draggable' aos elementos .todo
document.addEventListener("DOMContentLoaded", () => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    todo.setAttribute("draggable", true);
    todo.addEventListener("dragstart", handleDragStart);
    todo.addEventListener("dragover", handleDragOver);
    todo.addEventListener("drop", handleDrop);
  });

  updateTotalCount(); // Atualiza o total ao carregar a página
  updateDoneCount(); // Atualiza as tarefas concluídas ao carregar a página
  updateOpenCount(); // Atualiza as tarefas em aberto ao carregar a página
});

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.outerHTML);
  e.target.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const draggedHTML = e.dataTransfer.getData("text/plain");
  const draggedElement = document.createElement("div");
  draggedElement.innerHTML = draggedHTML;

  const todoList = document.getElementById("todo-list");

  // Insere o elemento arrastado na posição solta
  if (e.target.classList.contains("todo")) {
    todoList.insertBefore(draggedElement.firstChild, e.target.nextSibling);
  } else {
    todoList.appendChild(draggedElement.firstChild);
  }

  // Remove a classe de arrastar do elemento original
  document.querySelector(".dragging").classList.remove("dragging");

  // Atualiza a ordem no localStorage
  updateTodoOrderLocalStorage();
}

function updateTodoOrderLocalStorage() {
  const todos = document.querySelectorAll(".todo");
  const todosData = [];

  todos.forEach((todo, index) => {
    const text = todo.querySelector("h3").innerText;
    const done = todo.classList.contains("done") ? 1 : 0;

    todosData.push({ text, done, order: index });
  });

  localStorage.setItem("todos", JSON.stringify(todosData));
}

loadTodos();
