'use strict'


const { task } = require('bionode-watermill');


const fs = require('fs')
const through = require('through2')


const firstTask = task({
	input: '*.input.txt',
	output: '*.output.txt',
	name: 'Uppercase'
}, ({ input }) => {
	fs.createReadStream(input)
		.pipe(through(function (chunk, enc, next) {
			this.push(chunk.toString().toUpperCase())


			next(null)
		}))
		.pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/alphabet.output.txt'))
	}
)

firstTask()









// const { task } = require('bionode-watermill');

// const uppercaser = task({
// 	input: '*.lowercase',
// 	output: '*.uppercase',
// 	name: 'Uppercase * .lowercase -> *.uppercase'
// }, function(props) {
// 	const input = props.input
// 	const output = input.replace(/lowercase$/, 'uppercase')

// 	return `cat ${input} | tr '[:lower:]' '[:upper:]' > ${output}`

// })


// uppercaser()
// 	.then(() => console.log('Task finished'))
// 	.catch(err => console.log(err))