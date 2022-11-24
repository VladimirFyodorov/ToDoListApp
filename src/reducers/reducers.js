const initialState = {
	tasks: [],
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