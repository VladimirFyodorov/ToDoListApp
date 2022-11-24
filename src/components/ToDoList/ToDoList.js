import React from 'react';
import {connect} from 'react-redux';
import './ToDoList.css';
import ToDoListItem from '../ToDoListItem';

const ToDoList = ({tasks, formData}) => {
	return (
		<div className="to-do-list">
			<h3>Tasks</h3>
			{tasks && 
				tasks
					// task shouldn't both in form and in list => filter it out
					.filter(task => task.id !== formData.id)
					.map(task => <ToDoListItem key={task.id} task={task}/>)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tasks: state.tasks,
		formData: state.formData,
	};
};

export default connect(mapStateToProps)(ToDoList);