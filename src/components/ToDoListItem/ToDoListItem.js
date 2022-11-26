import React from 'react';
import './ToDoListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';


import { db } from '../../firebase';
import { ref, update, remove } from 'firebase/database';

const ToDoListItem = ({task, toggleShowedTaskId, showedTaskId, setFormData}) => {
	const strName = `${task.title}: due ${task.dueDate}`;
	const strClassName = `to-do-list-item ${(task.isDone? 'status-done': '')}`;
	const strDescription = `Description: ${task.description}`;
	const thisTaskIsShowed = task.uuid === showedTaskId;

	const onShowTask = (e) => {
		// check that it wasn't click on btn. If so than show
		if (!['checkbox', 'editBtn', 'deleteBtn'].includes(e.target.id)) {
			toggleShowedTaskId(task.uuid);
		}
	};

	const toggleTaskIsDone = () => {
		const newTask = {...task, isDone: !task.isDone};
		update(ref(db, `/${task.uuid}`), newTask);
	};

	const handleEdit = () => {
		setFormData(task);
	};

	const handleDelete = () => {
		remove(ref(db, `/${task.uuid}`));
	};

	return (
		<div className={strClassName} onClick={(e) => onShowTask(e)}>
			<div className="task-main-data">
				<p>{strName}</p>
				<div className="task-btns">
					<input
						id="checkbox"
						type="checkbox"
						checked={task.isDone}
						style={{'cursor': 'pointer'}}
						onChange={toggleTaskIsDone}/>
					<FontAwesomeIcon
						id="editBtn"
						icon={faEdit}
						style={{'cursor': 'pointer'}}
						onClick={handleEdit}/>
					<FontAwesomeIcon
						id="deleteBtn"
						icon={faTrash}
						style={{'cursor': 'pointer'}}
						onClick={handleDelete}/>
				</div>
			</div>
			{thisTaskIsShowed &&
				<p className="task-option-description">{strDescription}</p>
			}
		</div>
	);
};


export default ToDoListItem;