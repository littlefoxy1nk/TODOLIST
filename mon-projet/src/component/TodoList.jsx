import React from 'react';
import { useState, useEffect } from 'react';
import './TodoList.css'

function TodoList() {
  // State variables
  const [todos, setTodos] = useState([]); // List of tasks
  const [newTask, setNewTask] = useState(''); // New task input
  const [update, setUpdate] = useState(null); // Task being edited
  const [editTask, setEditTask] = useState(''); // Edited task text

  // Fetch tasks from the API
  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Erreur lors de la récupération des tâches', error));
  }, []);

  // Add a new task to the API
  const addTask = () => {
    if (newTask.trim() === '') return; // Prevent adding empty tasks

    const todo = { task: newTask, completed: false };

    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTask('');
      });
  };

  // Delete a task
  const deleteTask = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };
  

  // Enable edit mode for a task
  const enableEditMode = (id, currentTask) => {
    setUpdate(id);
    setEditTask(currentTask);
  };

  // Update a task in the API
  const updateTask = (id) => {
    if (editTask.trim() === '') return; // Prevent updating to an empty task

    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editTask }),
    }).then(() => {
      setTodos(todos.map((todo) =>
        todo.id === id ? { ...todo, task: editTask } : todo
      ));
      setUpdate(null);
      setEditTask('');
    });
  };

  // Handle input change for new tasks
  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  // Handle input change for editing tasks
  const handleEditTaskChange = (e) => {
    setEditTask(e.target.value);
  };

  return (
    <>
      <h2 className='title'>TOBUY</h2>
      
      <input 
        type="text" 
        value={newTask} 
        onChange={handleNewTaskChange}
        placeholder="what do you need ?"
      />
      <button className='add' onClick={addTask}>ADD</button>

      {todos.map((todo) => (
  <div key={todo.id} className="todo">
    {update === todo.id ? (
      <>
        <input 
          type="text" 
          value={editTask} 
          onChange={handleEditTaskChange}
        />
        <button onClick={() => updateTask(todo.id)}>Enregistrer</button>
      </>
    ) : (
      <>
        <div className="todo-task">
          <h3>{todo.task}</h3>
        </div>
        <div className="todo-actions">
          <button className="edit" onClick={() => enableEditMode(todo.id, todo.task)}>Modifier</button>
          <button className="delete" onClick={() => deleteTask(todo.id)}>X</button>
        </div>
      </>
    )}
  </div>
))}

    </>
  );
}

export default TodoList;

