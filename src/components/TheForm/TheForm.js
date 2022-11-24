import React, { useState } from 'react';
import { connect } from 'react-redux';
import './TheForm.css';
import { postTask } from '../../actions';

const TheForm = ({postTask}) => {
	const [formData, setFormData] = useState({});
	const {title, dueDate, describtion} = formData;

	const onSubmit = () => {
		postTask(formData);
		setFormData({});
	};

	const onChange = (e, key) => {
		const newObj = {...formData};
		newObj[key] = e.target.value;
		setFormData(newObj);
	};

	return (
		<div className="the-form">
			<h3>Form</h3>
			<input
				placeholder="Title"
				value={title || ''}
				onChange={(e) => onChange(e, 'title')}/>
			<input
				placeholder="Due date"
				type="date"
				value={dueDate || ''}
				onChange={(e) => onChange(e, 'dueDate')}/>
			<textarea
				placeholder="Describtion"
				value={describtion || ''}
				onChange={(e) => onChange(e, 'describtion')}/>	
			<div>
				<input placeholder="Files"/>
			</div>
			<button className="btn-login" type="submit" onClick={onSubmit}>Add</button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {tasks: state.tasks};
};

const mapDispatchToProps = {postTask};

export default connect(mapStateToProps, mapDispatchToProps)(TheForm);