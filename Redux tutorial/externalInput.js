'use strict'

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))


const {createStore, applyMiddleware } = require('redux')
const createSagaMiddleware = require('redux-saga').default
const { takeEvery } = require('redux-saga')


//const { buffers, eventChannel, END } = require('redux-saga')
const { call, put, take } = require('redux-saga/effects')
const { EventEmitter2 } = require('eventemitter2')

const matchToFs = require('../matchers/match-to-fs.js')




const LOAD_INPUTS = 'LOAD_INPUTS'
const RESOLVE_INPUTS = 'RESOLVE_INPUTS'
const LOAD_FAIL = 'LOAD_FAIL'


// reducers

const defaultState = {}

const reducer = (state = defaultState, action) => {   

	switch(action.type) {
		case 'LOAD_INPUTS':
			return Object.assign({}, state, { desired: action.payload })
		case 'RESOLVE_INPUTS' :
			return Object.assign({}, state, { desired: action.path })
		case 'LOAD_FAIL' :
			return Object.assign({}, state )
		default :
			return state
	}
}

// Action 

const loadExternalInputs = (data) => ({
	type: 'LOAD_INPUTS',
	payload: data
})

const resolveInput = (path) => ({
	type: 'RESOLVE_INPUTS',
	payload: path
})

const loadFail = (err) => {
	type: 'LOAD_FAIL'
	//payload: err,
	//error : true
}


function getpath(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}


function readExternalInput(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) {
				reject(err)
			} else {
				try {
				 const results = resolve(JSON.parse(data))
				} catch(err) {
					reject (err)
				}
			}
		})
	})
}





function* loadInputs() {

	const action = yield take(LOAD_INPUTS)
	const { path } = action.payload

	try {
		const result = yield call(getpath, path)
		const { data } = result

		yield put(loadExternalInputs(data))
	}
	catch (err) {
		yield put(loadFail(err))
	}

}




function* resolveExternalInput() {

	const logEmitter = new EventEmitter2({ wildcard: true })

	
	try {

		const action = yield take(RESOLVE_INPUTS)
		const externalInput = yield call(readExternalInput, process.argv[2])
		logEmitter.emit('log',`Error ${externalInput}`)


		Promise.all(Object.keys(externalInput).map(key => matchToFs(externalInput[key])))
			.then((data) => {
				data.forEach((key) => {
				const absolutePath = path.resolve(key)
		})
	})

	yield put(resolveInput(path))
		
	} catch (err) {
		yield put(loadFail(err))
	}
}

//store 

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(loadInputs, resolveExternalInput)

//console.log(state)
console.log(process.argv[2])

//console.log(result)

