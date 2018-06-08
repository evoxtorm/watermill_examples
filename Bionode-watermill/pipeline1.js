'use strict'

const {
	task,
	join,
	junction,
	fork
} = require('bionode-watermill')

const concatTask = task({
	input: '*.fas',
	output: '*.fas',
	name : 'New task',
	params: {output: 'concat.fas'}
}, ( object ) => {
	console.log('input_directory: ', object.dir)
	console.log('input_variable: ', object.params)
	return `cat ${object.input.join(' ')} > ${object.params.output}`
	}
)

concatTask()