import React from 'react';
import {connect} from 'react-redux';
import './ToDoList.css';
import ToDoListItem from '../ToDoListItem';

const ToDoList = ({tasks}) => {
	return (
		<div className="to-do-list">
			<h3>Tasks</h3>
			{tasks && tasks.map(task => <ToDoListItem key={task.id} task={task}/>)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tasks: state.tasks,
	};
};

export default connect(mapStateToProps)(ToDoList);