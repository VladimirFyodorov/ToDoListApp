import React from 'react';
import './TheForm.css';

const TheForm = () => {
	return (
		<div className="the-form">
			<h3>Form</h3>
			<input placeholder="Title"/>
			<input placeholder="Due date"/>
			<textarea placeholder="Describtion"/>
			<div>
				<input placeholder="Files"/>
			</div>
			<button className="btn-login" type="submit">Add</button>
		</div>
	);
};

export default TheForm;