import React from 'react';
import './TheForm.css';
import { db } from '../../firebase';
import { uid } from 'uid';
import { set, ref, update } from 'firebase/database';


const TheForm = ({formData, setFormData}) => {
	const {uuid, title, dueDate, description} = formData;

	const cleanForm = () => {
		setFormData({title: '', dueDate: '', description: '', files: [], isDone: false});
	};


	const onSubmit = () => {
		// has uuid => update, else => post
		if (Object.hasOwn(formData, 'uuid')) {
			update(ref(db, `/${uuid}`), formData);
			cleanForm();
		} else {
			const newTask = {...formData, uuid: uid()};
			set(ref(db, `/${newTask.uuid}`), newTask);
			cleanForm();
		}
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


export default TheForm;