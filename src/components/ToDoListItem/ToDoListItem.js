import React from 'react';
import './ToDoListItem.css';
import * as dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { ref as dbRef, update, remove } from 'firebase/database';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';

/**
 * @namespace ToDoListItem
 * @desc Renders list item
 * @param {Array} tasks - list of tasks (state)
 * @param {Function} setTasks - Dispatcher for changing tasks
 * @param {Array} filesUrls - list of files' urls (state)
 * @param {Function} setFilesUrls - Dispatcher for changing files' urls
 * @param {String} showedTaskId - Showed task's uuid
 * @param {Function} toggleShowedTaskId - Dispatcher for changing showed task's uuid
 * @param {Function} setFormData - Dispatcher for changing form's data
 */
function ToDoListItem({
  task, setTasks, filesUrls, setFilesUrls, showedTaskId, toggleShowedTaskId, setFormData,
}) {
  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Formated due date of the task or empty string if task doesn't have a due date
   */
  const formatedDate = (task.dueDate) ? dayjs(task.dueDate).format('ddd DD.MM.YYYY') : '';

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Name of the Task. Consists of task's title and formated due date
   * @example 'Do laundry: due Sun 11.12.2022'
   */
  const strName = `${task.title}: due ${formatedDate}`;
  // completed if task is done or if deadline has past

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Task is completed if it is done or if deadline has past
   */
  const isCompleted = task.isDone || Date.now() >= Date.parse(task.dueDate);

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc className of the list item. Depends on isCompleted
   * @example 'to-do-list-item'
   * @example 'to-do-list-item status-done'
   */
  const strClassName = `to-do-list-item ${(isCompleted ? 'status-done' : '')}`;

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Task is showed it's id to showedTaskId
   */
  const thisTaskIsShowed = task.uuid === showedTaskId;

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Files consist of task files and filesUrls.
   * For each task's files find file's url in filesUrls and combine datasets
   */
  const files = (task?.files || []).map((f) => (
    { ...f, ...filesUrls.find((af) => af.uuid === f.uuid) }
  ));

  /**
   * @access public
   * @memberof ToDoListItem
   * @param {event} e - Click event on task div
   * @desc Showes task through change of showedTaskId
   */
  const onShowTask = () => {
    toggleShowedTaskId(task.uuid);
  };

  /**
   * @access public
   * @memberof ToDoListItem
   * @desc Updates task's isDone to !isDone. Called upon click on check box button
   */
  const toggleTaskIsDone = () => {
    const newTask = { ...task, isDone: !task.isDone };
    update(dbRef(db, `/${task.uuid}`), newTask);
  };

  /**
   * @access public
   * @memberof ToDoListItem
   * @param {event} e - Click event
   * @desc Fills From's data with data of this task. Called upon click on edit button.
   */
  const handleEdit = (e) => {
    e.stopPropagation();
    setFormData(task);
  };

  /**
   * @access public
   * @memberof ToDoListItem
   * @param {event} e - Click event
   * @desc Delete task and task's files from database. Called upon click on delete button
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    // delete task
    remove(dbRef(db, `/${task.uuid}`)).then(() => (
      setTasks((tasks) => tasks.filter(({ uuid }) => uuid !== task.uuid))
    ));
    // delete task's files
    (task.files || []).forEach((f) => {
      // delete file on the server
      deleteObject(storageRef(storage, `/${f.uuid}`)).then(() => (
        // delete file's url localy
        setFilesUrls((file) => file.filter(({ uuid }) => uuid !== f.uuid))
      ));
    });
  };

  return (
    <div className={strClassName} onClick={onShowTask}>
      <div className="task-main-data">
        <p>{strName}</p>
        <div className="task-btns">
          <input
            type="checkbox"
            checked={task.isDone}
            style={{ cursor: 'pointer' }}
            onClick={(e) => e.stopPropagation()}
            onChange={toggleTaskIsDone}
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ cursor: 'pointer' }}
            onClick={handleEdit}
          />
          <FontAwesomeIcon
            icon={faTrash}
            style={{ cursor: 'pointer' }}
            onClick={handleDelete}
          />
        </div>
      </div>
      {thisTaskIsShowed
      && (
        <>
          <p className="task-option-description">{`Description: ${task.description}`}</p>
          <p className="task-option-description">Files:</p>
        </>
      )}
      {thisTaskIsShowed && files
      && files.map((file) => (
        <p key={file?.uuid} className="task-option-description">
          <a className="task-option-description" href={file?.url}>
            {file?.name}
          </a>
        </p>
      ))}
    </div>
  );
}

export default ToDoListItem;
