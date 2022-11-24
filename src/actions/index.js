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

export {
	tasksLoaded,
	postTask,
	putTask,
	deleteTask,
};