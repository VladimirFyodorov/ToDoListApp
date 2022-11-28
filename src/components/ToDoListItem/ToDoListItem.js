import React from 'react';
import './ToDoListItem.css';
import * as dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { ref as dbRef, update, remove } from 'firebase/database';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';

function ToDoListItem({
  task, setTasks, filesUrls, setFilesUrls, showedTaskId, toggleShowedTaskId, setFormData,
}) {
  const formatedDate = (task.dueDate) ? dayjs(task.dueDate).format('ddd DD.MM.YYYY') : '';
  const strName = `${task.title}: due ${formatedDate}`;
  // completed if task is done or if deadline has past
  const isCompleted = task.isDone || Date.now() >= Date.parse(task.dueDate);
  const strClassName = `to-do-list-item ${(isCompleted ? 'status-done' : '')}`;
  const strDescription = `Description: ${task.description}`;
  const thisTaskIsShowed = task.uuid === showedTaskId;
  // for each task's files find file's url in filesUrls
  const files = (task?.files || []).map((f) => (
    { ...f, ...filesUrls.find((af) => af.uuid === f.uuid) }
  ));

  const onShowTask = (e) => {
    // check that it wasn't click on btns. If so than show
    if (!['checkbox', 'editBtn', 'deleteBtn'].includes(e.target.id)) {
      toggleShowedTaskId(task.uuid);
    }
  };

  const toggleTaskIsDone = () => {
    const newTask = { ...task, isDone: !task.isDone };
    update(dbRef(db, `/${task.uuid}`), newTask);
  };

  const handleEdit = () => {
    setFormData(task);
  };

  const handleDelete = () => {
    // delete task
    remove(dbRef(db, `/${task.uuid}`)).then(() => (
      setTasks((tasks) => tasks.filter(({ uuid }) => uuid !== task.uuid))
    ));
    // delete task's files
    task.files.forEach((f) => {
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
            id="checkbox"
            type="checkbox"
            checked={task.isDone}
            style={{ cursor: 'pointer' }}
            onChange={toggleTaskIsDone}
          />
          <FontAwesomeIcon
            id="editBtn"
            icon={faEdit}
            style={{ cursor: 'pointer' }}
            onClick={handleEdit}
          />
          <FontAwesomeIcon
            id="deleteBtn"
            icon={faTrash}
            style={{ cursor: 'pointer' }}
            onClick={handleDelete}
          />
        </div>
      </div>
      {thisTaskIsShowed
      && (
        <>
          <p className="task-option-description">{strDescription}</p>
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
