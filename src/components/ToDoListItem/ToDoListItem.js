import React from 'react';
import './ToDoListItem.css';

const ToDoListItem = ({task}) => {
	const str = `${task.title}: due ${task.dueDate}`;
	const strClassName = `to-do-list-item ${(task.isDone? 'status-done': '')}`;
	return (
		<div className={strClassName}>
			<h4>{str}</h4>
		</div>
	);
};

export default ToDoListItem;