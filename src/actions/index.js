const tasksLoaded = () => {
	return {type: 'TASKS_LOADED'};
};

const postTask = (payload) => {
	return {type: 'POST_TASK', payload};
};

const putTask = (payload) => {
	return {type: 'PUT_TASK', payload};
};

const deleteTask = (payload) => {
	return {type: 'DELETE_TASK', payload};
};

const startEditTask = (payload) => {
	return {type: 'START_EDIT_TASK', payload};
};

const editTask = (payload) => {
	return {type: 'EDIT_TASK', payload};
};

const endEditTask = (payload) => {
	return {type: 'END_EDIT_TASK', payload};
};

export {
	tasksLoaded,
	postTask,
	putTask,
	deleteTask,
	startEditTask,
	editTask,
	endEditTask,
};