const initialState = {
	tasks: [
		{
			id: 1,
			title: 'Do laundry',
			description: 'Wash socks, T-shorts and pants',
			dueDate: '2022-12-13',
			isDone: false,
			files: [],
		},
		{
			id: 2,
			title: 'Finish job task',
			description: 'Make toDo list app',
			dueDate: '2022-11-30',
			isDone: true,
			files: [],
		},
	],
	formData: {hasData: false},
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

	case 'PUT_TASK': {
		const oldTask = state.tasks.find(task => task.id === action.payload.id);
		const newTask = {...oldTask, ...action.payload};
		const tasks = [...state.tasks].map(task => {
			return (task.id === newTask.id) ? newTask : task;
		});

		return {...state, tasks};
	}

	case 'DELETE_TASK': {
		const index = state.tasks.findIndex(task => task.id === action.payload.id);
		const tasks = [...state.tasks.slice(0, index), ...state.tasks.slice(index + 1)];
		return {...state, tasks};
	}

	case 'START_EDIT_TASK': {
		return {...state, formData: {hasData: true, ...action.payload}};
	}

	case 'EDIT_TASK': {
		return {...state, formData: {...state.formData, ...action.payload}};
	}
	
	case 'END_EDIT_TASK': {
		const newTask = {...action.payload};
		delete newTask.hasData;
		const tasks = [...state.tasks].map(task => {
			return (task.id === newTask.id) ? newTask : task;
		});

		console.log({...state, tasks, formData: {hasData: false}});

		return {...state, tasks, formData: {hasData: false}};
	}

	default:
		return state;
	}
};


export default reducer;