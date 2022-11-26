import React, { useState, useEffect } from 'react';
import './ThePage.css';
import { ref, onValue } from 'firebase/database';
import ToDoList from '../ToDoList';
import TheForm from '../TheForm';

import db from '../../firebase';

function ThePage() {
  const blankTask = {
    title: '', dueDate: '', description: '', files: [], isDone: false,
  };
  const [formData, setFormData] = useState(blankTask);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setTasks(Object.values(data));
      }
    });
  }, []);

  return (
    <div className="wrapper">
      <ToDoList formData={formData} setFormData={setFormData} tasks={tasks} />
      <TheForm formData={formData} setFormData={setFormData} />
    </div>
  );
}

export default ThePage;
