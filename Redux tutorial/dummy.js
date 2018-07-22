'use strict'

const { createStore } = require('redux')


//Actions

const Actions = {
	LEVEL_UP: 'LEVEL_UP'
}


// Action creators

const levelUp = () => ({
	type: Actions.LEVEL_UP
})



// Reducers

const levelReducer = (state = 1, action) => {
	switch(action.type) {
		case Actions.LEVEL_UP:
		return state + 1
	}
	return state
}



// Store

const store = createStore(levelReducer)



// Run

console.log(store.getState())
store.dispatch(levelUp())
console.log(store.getState())