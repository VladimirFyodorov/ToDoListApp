import React, { useState } from 'react';
import './ToDoList.css';
import ToDoListItem from '../ToDoListItem';

function ToDoList({
  tasks, files, formData, setFormData, setTasks, setFiles,
}) {
  const [showedTaskId, setShowedTaskId] = useState('');

  const toggleShowedTaskId = (id) => {
    // if same ids => this is the second click on same row => need to hide this row
    if (id !== showedTaskId) {
      setShowedTaskId(id);
    } else {
      setShowedTaskId('');
    }
  };

  return (
    <div className="to-do-list">
      <h3>Tasks</h3>
      {tasks
      && tasks
      // task shouldn't be both in form and in list => filter it out
        .filter((task) => task.uuid !== formData.uuid)
        .map((task) => (
          <ToDoListItem
            key={task.uuid}
            task={task}
            setTasks={setTasks}
            allFiles={files}
            setFiles={setFiles}
            setFormData={setFormData}
            showedTaskId={showedTaskId}
            toggleShowedTaskId={toggleShowedTaskId}
          />
        ))}
    </div>
  );
}

export default ToDoList;
