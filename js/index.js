
const filterToggler = document.getElementById('filter-btn');

const filterDropdown = document.querySelector('.filter-select');

const filterChosen = document.querySelector('.filter-option-chosen');

const todoContainer = document.querySelector('.todo-container');

const form = document.querySelector('form');

const todoItem = document.getElementById('todo-item');

let todoList = JSON.parse(localStorage.getItem('todos')) ? JSON.parse(localStorage.getItem('todos')) : [];

document.addEventListener('DOMContentLoaded', () => {
     displayTodo(filterChosen.innerHTML)
});

filterToggler.onclick = () => {
     filterDropdown.classList.toggle('active');
}

const optionBtns = document.querySelectorAll('.filter-option');

for (filter of optionBtns) {
     filter.addEventListener('click', (e) => {
          const option = e.target.innerHTML;
          filterChosen.innerHTML = option;
          filterDropdown.classList.remove('active');
          displayTodo(option);
     })
}

const handleSubmit = (e) => {
     e.preventDefault();
     const todoText = todoItem.value;

     const addTodo = new Promise((resolve, reject) => {
          if (todoText) {
               const todo = {
                    id: generateRandomId(),
                    text: todoText,
                    status: 'uncompleted'
               };
               resolve(todo);
          } else {
               reject('Todo text is empty');
          }
     });

     addTodo
          .then((todo) => {
               todoList = [...todoList, todo];
               saveToLocalStorage(todoList);
               todoItem.value = '';
          }).then(() => {
               displayTodo(filterChosen.innerHTML);
          })
          .catch((error) => {
               console.error(error);
          });
};

form.addEventListener('submit', handleSubmit);


function displayTodo(filter_param) {
     if (todoList.length > 0) {
          let html = '';
          filter_param = filter_param.trim();
          if (filter_param === 'All') {
               todoList.forEach(todo => {
                    html += renderTodo(todo)
               })
          } else {
               todoList.filter(todo => todo.status === filter_param.toLowerCase()).forEach(todo => {
                    html += renderTodo(todo)
               })
          }
          todoContainer.innerHTML = html;

          const checkBtns = document.querySelectorAll('.fa.fa-check');
          const deleteBtns = document.querySelectorAll('.fa.fa-trash');
          checkBtns.forEach(checkBtn => {
               checkBtn.addEventListener('click', toggleStatus)
          })
          
          deleteBtns.forEach(deleteBtn => {
               deleteBtn.addEventListener('click', deleteTodo)
          })
     } else {
          todoContainer.innerHTML = `<h2 style="text-align:center; color: #fff;">Todo list empty</h2>`;
     }
}


function renderTodo(todo) {
     return `<div class="todo">
     ${(todo.status == 'uncompleted') ? `<p class="text">${todo.text}</p>` : `<del>${todo.text}</del>`}
     <i class="fa fa-check" data-id=${todo.id}></i>
     <i class="fa fa-trash" data-id=${todo.id}></i>
     </div>`;
     
}

function saveToLocalStorage(todos) {
     localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodo(e) {
     const id = e.target.dataset.id;
     todoList = todoList.filter(todo => todo.id !== id);
     saveToLocalStorage(todoList);
     displayTodo(filterChosen.innerHTML);
}

function toggleStatus(e) {
     const id = e.target.dataset.id;
     todoList = todoList.map(todo => {
          if (todo.id === id) {
               if (todo.status == 'uncompleted') {
                    todo = { ...todo, status: 'completed' };
               } else {
                    todo = { ...todo, status: 'uncompleted' };
               }
          }
          return todo;
     });
     saveToLocalStorage(todoList);
     displayTodo(filterChosen.innerHTML);
}


function generateRandomId() {
     const str = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
     let cnt = 0;
     id = '';
     while (cnt < 10) {
          id += str[Math.floor(Math.random() * str.length)];
          cnt++;
     }
     return id;
}