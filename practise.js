'use strict' 

const { 
	task,
	join,
	junction,
	fork
	} = require('bionode-watermill')


	const fs = require('fs')
	const through = require('through2')

const concatTask = task({
	input: '*.fas',
	ouput: '*.fas',
	name: 'Concat',
	params: {output: 'concat.fas'}
}, ( object ) => {
	console.log('input directory: ', object.dir)
	console.log('input_variable: ',object, object.params)
	return `cat ${object.input.join(' ')} > ${object.params.output}`
	}
)

concatTask()

