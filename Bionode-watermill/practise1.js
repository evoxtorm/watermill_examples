'use strict'


const { 
	task,
	join,
	junction,
	fork
	} = require('bionode-watermill')


	const fs = require('fs')
	const through = require('through2')


	// const newTask = task({
	// 	input: '*.fas',
	// 	ouput: '*.fas',
	// 	name: 'Uppercase fas'
	// }, ({ input }) => {
	// 	fs.createReadStream(input)
	// 		.pipe(through(function (chunk, enc, next){
	// 			this.push(chunk.toString().toUpperCase())

	// 			next()
	// 		}))
	// 		.pipe(fs)
	// })

	const newTask = task({
		input:'*.fas',
		ouput: '.*output.fas',
		name: 'Capitalize alphabet',
		params: { output: 'concat.fas' }
	}, ({ input }) => {
		fs.createReadStream(input)
			.pipe(through(function (chunk, enc, next) {
				this.push(chunk.toString().toUpperCase())


			next()
			}))
			.pipe(fs.createWriteStream(input.split('/').slice(0, -1).join + '/output.concat.fas'))
		}
	)

	newTask()