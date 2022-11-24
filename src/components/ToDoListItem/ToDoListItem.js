import React from 'react';
import { connect } from 'react-redux';
import './ToDoListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { putTask, deleteTask, startEditTask } from '../../actions';

const ToDoListItem = ({task, putTask, deleteTask, startEditTask}) => {
	const str = `${task.title}: due ${task.dueDate}`;
	const strClassName = `to-do-list-item ${(task.isDone? 'status-done': '')}`;

	return (
		<div className={strClassName}>
			<p>{str}</p>
			<div className="task-btns">
				<input
					type="checkbox"
					checked={task.isDone}
					style={{'cursor': 'pointer'}}
					onChange={() => putTask({...task, isDone: !task.isDone})}/>
				<FontAwesomeIcon
					icon={faEdit}
					style={{'cursor': 'pointer'}}
					onClick={() => startEditTask(task)}/>
				<FontAwesomeIcon
					icon={faTrash}
					style={{'cursor': 'pointer'}}
					onClick={() => deleteTask({...task})}/>
			</div>
		</div>
	);
};
const mapStateToProps = (state) => {
	return state;
};

const mapDispatchToProps = { putTask, deleteTask, startEditTask };

export default connect(mapStateToProps, mapDispatchToProps)(ToDoListItem);