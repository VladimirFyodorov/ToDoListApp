import React from 'react';
import './ThePage.css';
import ToDoList from '../ToDoList';
import TheForm from '../TheForm';

const ThePage = () => {
	return (
		<div className='wrapper'>
			<ToDoList/>
			<TheForm/>
		</div>
	);
};

export default ThePage;