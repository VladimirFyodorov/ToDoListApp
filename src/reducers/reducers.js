const initialState = {
	tasks: [
		{
			id: 1,
			title: 'Do laundry',
			description: 'Wash socks, T-shorts and pants',
			dueDate: '13.12.2022',
			isDone: false,
			files: [],
		},
		{
			id: 2,
			title: 'Finish job task',
			description: 'Make toDo list app',
			dueDate: '30.11.2022',
			isDone: true,
			files: [],
		},
	],
};

const reducer = (state = initialState, action = {}) => {
	switch (action.type) {

	case 'TASKS_LOADED':
		return {
			...state, tasks: action.payload
		};

	case 'POST_TASK': {
		const id = state.tasks.reduce((acc, task) => (acc < task.id) ? task.id : acc, 0) + 1;
		const newTask = {
			id,
			title: '',
			description: '',
			dueDate: '',
			isDone: false,
			files: [],
			...action.payload,
		};

		return {
			...state, tasks: [...state.tasks, newTask]
		};
	}

	default:
		return state;
	}
};


export default reducer;