import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state


  useEffect(() => {
    // Fetching the tasks from task.json using axios.get
    // Set a timeout to show the skeleton effect properly
    setTimeout(() => {
      axios.get('/task.json')
        .then(response => { setTasks(response.data); setLoading(false) })  // Correctly setting tasks from fetched data
        .catch(error => console.error('Error fetching tasks:', error));
    }, 2000)
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
