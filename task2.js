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
  output: '*.fas',
  params: {output: 'concat.fas'}
}, ( object ) => {
  console.log('input_directory: ', object.dir)
  console.log('input_variable: ', object, object.params)
  return `cat ${object.input.join(' ')} > ${object.params.output}`
  }
)


concatTask()


const myTask = task({
	input:'*.concat.fas',
	output: '*.output.fas',
	name: 'capitalize sequence'
}, ({ input }) => {
	fs.createReadStream(input)
		.pipe(through(function (chunk, enc, next){
			this.push(chunk.toString().toUpperCase())

			next()
		}))
		.pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/new.output.fas'))
	}
)

myTask()


const pipeline = join(concatTask, myTask)

pipeline()