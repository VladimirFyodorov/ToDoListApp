import React, { useState } from 'react';
import './ToDoList.css';
import ToDoListItem from '../ToDoListItem';

/**
 * @namespace ToDoList
 * @desc Renders {@link ToDoListItem}(s)
 * @param {Array} tasks - list of tasks (state)
 * @param {Function} setTasks - Dispatcher for changing tasks
 * @param {Array} filesUrls - list of files' urls (state)
 * @param {Function} setFilesUrls - Dispatcher for changing files' urls
 * @param {Array} formData - Form's data (state)
 * @param {Function} setFormData - Dispatcher for changing form's data
 */
function ToDoList({
  tasks, setTasks, filesUrls, setFilesUrls, formData, setFormData,
}) {
  const [showedTaskId, setShowedTaskId] = useState('');

  /**
   * @access public
   * @memberof ToDoList
   * @param {String} TaskUuid - Task UUID
   * @desc Toggles showed task's UUID.
   * If input id is the same as is already displayed
   * => this is the second click on same row
   * => need to hide this row
   * => sets ID to empty string
   */
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
            filesUrls={filesUrls}
            setFilesUrls={setFilesUrls}
            setFormData={setFormData}
            showedTaskId={showedTaskId}
            toggleShowedTaskId={toggleShowedTaskId}
          />
        ))}
    </div>
  );
}

export default ToDoList;
