import React, { useState, useEffect } from 'react';
import './ThePage.css';
import { ref as dbRef, onValue } from 'firebase/database';
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
import ToDoList from '../ToDoList';
import TheForm from '../TheForm';

import { db, storage } from '../../firebase';

function ThePage() {
  const blankTask = {
    title: '', dueDate: '', description: '', files: [], isDone: false,
  };
  const [formData, setFormData] = useState(blankTask);
  const [tasks, setTasks] = useState([]);
  const [filesUrls, setFilesUrls] = useState([]);

  // loading tasks
  useEffect(() => {
    onValue(dbRef(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setTasks(Object.values(data));
      }
    });
  }, []);

  // loading filesUrls
  useEffect(() => {
    listAll(storageRef(storage))
      .then((res) => {
        res.items.forEach((item) => {
          const uuid = item._location.path_;
          // loading files' urls
          getDownloadURL(item).then((url) => {
            setFilesUrls((fs) => [...fs, { url, uuid }]);
          });
        });
      });
  }, []);

  return (
    <div className="wrapper">
      <ToDoList
        formData={formData}
        setFormData={setFormData}
        tasks={tasks}
        setTasks={setTasks}
        setFilesUrls={setFilesUrls}
        filesUrls={filesUrls}
      />
      <TheForm
        formData={formData}
        setFormData={setFormData}
        setTasks={setTasks}
        setFilesUrls={setFilesUrls}
        filesUrls={filesUrls}
      />
    </div>
  );
}

export default ThePage;
