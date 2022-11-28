import React, { useState, useEffect } from 'react';
import './ThePage.css';
import { ref as dbRef, onValue } from 'firebase/database';
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
import ToDoList from '../ToDoList';
import TheForm from '../TheForm';

import { db, storage } from '../../firebase';

/**
 * @namespace ThePage
 * @desc The page function loads data: Tasks and Files' URLs.
 * Renders {@link ToDoList} and {@link TheForm} elements
 */
function ThePage() {
  const blankTask = {
    title: '', dueDate: '', description: '', files: [], isDone: false,
  };

  const [formData, setFormData] = useState(blankTask);
  const [tasks, setTasks] = useState([]);
  const [filesUrls, setFilesUrls] = useState([]);

  /**
   * @access public
   * @memberof ThePage
   * @callback loadTasks
   * @desc Loades tasks from database and saves them in tasks (state).
   */
  useEffect(() => {
    onValue(dbRef(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setTasks(Object.values(data));
      }
    });
  }, []);

  /**
   * @access public
   * @memberof ThePage
   * @callback loadFilesUrls
   * @desc Loades files' urls from storage and saves them in filesUrls (state).
   */
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
