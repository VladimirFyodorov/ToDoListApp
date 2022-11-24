import React from 'react';
import { connect } from 'react-redux';
import './TheForm.css';
import { postTask, editTask, endEditTask } from '../../actions';

const TheForm = ({formData, postTask, editTask, endEditTask}) => {
	const {title, dueDate, description} = formData;


	const onSubmit = () => {
		if (Object.hasOwn(formData, 'id')) {
			endEditTask(formData);
		} else {
			postTask(formData);
		}
	};

	const onChange = (e, key) => {
		const newObj = {...formData};
		newObj[key] = e.target.value;
		editTask(newObj);
	};

	return (
		<div className="the-form">
			<h3>Form</h3>
			<input
				placeholder="Title"
				className="form"
				value={title || ''}
				onChange={(e) => onChange(e, 'title')}/>
			<input
				placeholder="Due date"
				className="form"
				type="date"
				value={dueDate || ''}
				onChange={(e) => onChange(e, 'dueDate')}/>
			<textarea
				placeholder="Description"
				value={description || ''}
				onChange={(e) => onChange(e, 'description')}/>	
			<div>
				<input className="form" placeholder="Files"/>
			</div>
			<button className="btn-login" type="submit" onClick={onSubmit}>Add</button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {formData: state.formData};
};

const mapDispatchToProps = { postTask, editTask, endEditTask };

export default connect(mapStateToProps, mapDispatchToProps)(TheForm);