'use strict'

const Promise = require('bluebird')
const fs = require('fs')
//const fs = Promise.promisifyAll(require('fs'))


const { createStore, combineStore } = require('redux')
const { combineReducers } = require('redux')
//const thunk  = require('redux-thunk')

const initialState = {
	resolved: {},
  	desired: {}
}


// Actions
const Actions = {
	LOAD_INPUTS: 'LOAD_INPUTS',
	RESOLVE_INPUTS: 'RESOLVE_INPUTS',
}

// Action creators

const loadInputs = (input) => ({
	type: Actions.LOAD_INPUTS,
	payload: input
})

const resolveInputs = (path) => ({
	type: Actions.RESOLVE_INPUTS,
	payload: path

})


// Reducers  

const loadInputReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.LOAD_INPUTS:
			return Object.assign({}, state, { desired: input })
	}
	return state
}


const resolveInputReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.RESOLVE_INPUTS:
			return Object.assign({}, state, { resolved: payload.path })
	}
	return state
}

 const input = process.argv[2]

 fs.readFile(input, (data, err) => {
  	if (err) {
  		console.error(err)
  	} else {
  		dispatch({ type: 'LOAD_DESIRED', payload: JSON.parse(data) })
  	}
  })


const reducer = combineReducers({
	loadInputs: loadInputReducer,
	resolveInputs: resolveInputReducer
})



const store  = createStore(reducer) 

store.subscribe(() => {
	console.log(JSON.stringify(store.getState()))
})


store.dispatch(loadInputs(input))
