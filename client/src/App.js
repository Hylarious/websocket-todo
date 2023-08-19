import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import randomID from '@hylarious/package-id';

const App = () => {

  const [socket, setSocket] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')

  useEffect(() => {
    const newSocket = io.connect('http://localhost:8000/');
    setSocket(newSocket);
   
    newSocket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });
  
    newSocket.on('updateData', (tasksList) => {
      updateTasks(tasksList);
      });
  }, []);


  const updateTasks = tasks => {
    setTasks(tasks)
  }

  const removeTask = (id, inStorage) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    inStorage && socket.emit('removeTask', id)
    
  }
  const submitForm = (e) => {
    e.preventDefault();
    if (taskName !== '') {
      const newTask = { id: randomID(10), name: taskName };
      addTask(newTask)
      socket.emit('addTask', newTask);
      setTaskName('');
    }
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (<li key={task.id} className="task">{task.name}<button onClick={() => removeTask(task.id, true)} className="btn btn--red">Remove</button></li>) )}
        </ul>
  
        <form id="add-task-form" onSubmit={e => submitForm(e)}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)}/>
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  )
}


export default App;
