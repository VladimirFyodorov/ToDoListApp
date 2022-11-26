import React, { useState } from 'react';
import './ToDoList.css';
import ToDoListItem from '../ToDoListItem';


const ToDoList = ({tasks, formData, setFormData}) => {

	const [showedTaskId, setShowedTaskId] = useState('');

	const toggleShowedTaskId = (id) => {
		if (id !== showedTaskId) {
			setShowedTaskId(id);
		} else {
			setShowedTaskId('');
		}
	};

	return (
		<div className="to-do-list">
			<h3>Tasks</h3>
			{tasks && 
				tasks
					// task shouldn't be both in form and in list => filter it out
					.filter(task => task.uuid !== formData.uuid)
					.map(task => <ToDoListItem
						key={task.uuid}
						task={task}
						setFormData={setFormData}
						showedTaskId={showedTaskId}
						toggleShowedTaskId={toggleShowedTaskId}/>)}
		</div>
	);
};


export default ToDoList;