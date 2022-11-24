const initialState = {
	tasks: [
		{
			id: 1,
			title: 'Do laundry',
			description: 'Wash socks, T-shorts and pants',
			toDoDate: '13.12.2022',
			isDone: false,
			files: [],
		},
		{
			id: 2,
			title: 'Finish job task',
			description: 'Make toDo list app',
			toDoDate: '30.11.2022',
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

		default:
			return state;
	}
};


export default reducer;