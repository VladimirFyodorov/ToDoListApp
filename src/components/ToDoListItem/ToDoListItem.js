import React from 'react';
import { connect } from 'react-redux';
import './ToDoListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { showTask, putTask, deleteTask, startEditTask } from '../../actions';

const ToDoListItem = ({task, showTask, showedTaskId, putTask, deleteTask, startEditTask}) => {
	const strName = `${task.title}: due ${task.dueDate}`;
	const strClassName = `to-do-list-item ${(task.isDone? 'status-done': '')}`;
	const strDescription = `Description: ${task.description}`;
	const thisTaskIsShowed = task.id === showedTaskId;
	const onShowTask = (e) => {
		// check that it wasn't click on btn. If so than show
		if (!['checkbox', 'editBtn', 'deleteBtn'].includes(e.target.id)) {
			showTask(task.id);
		}
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
						onChange={() => putTask({...task, isDone: !task.isDone})}/>
					<FontAwesomeIcon
						id="editBtn"
						icon={faEdit}
						style={{'cursor': 'pointer'}}
						onClick={() => startEditTask(task)}/>
					<FontAwesomeIcon
						id="deleteBtn"
						icon={faTrash}
						style={{'cursor': 'pointer'}}
						onClick={() => deleteTask({...task})}/>
				</div>
			</div>
			{thisTaskIsShowed &&
				<p className="task-option-description">{strDescription}</p>
			}
		</div>
	);
};
const mapStateToProps = (state) => {
	return {showedTaskId: state.showedTaskId};
};

const mapDispatchToProps = { showTask, putTask, deleteTask, startEditTask };

export default connect(mapStateToProps, mapDispatchToProps)(ToDoListItem);