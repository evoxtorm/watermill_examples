'use strict'

const {
  task,
  join,
  junction,
  fork
} = require('bionode-watermill')


const fs = require('fs')
const through = require('through2')

const myTask = task({
  input: 'file3.fas',
  output: '*output.fas',
  name: 'Capitalize alphabet'
}, ({ input }) => {
    fs.createReadStream(input)
      .pipe(through(function (chunk, enc, next) {
        this.push(chunk.toString().toUpperCase())

        next()
      }))
      .pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/new.output.fas'))
  }
)

const myTask1 = task({
  input: 'file2.fas',
  output: '*output.fas',
  name: 'Capitalize alphabet'
}, ({ input }) => {
    fs.createReadStream(input)
      .pipe(through(function (chunk, enc, next) {
        this.push(chunk.toString().toUpperCase())

        next()
      }))
      .pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/new.output.fas'))
  }
) 


const myTask2 = task({
  input: 'file1.fas',
  output: '*output.fas',
  name: 'Capitalize alphabet'
}, ({ input }) => {
    fs.createReadStream(input)
      .pipe(through(function (chunk, enc, next) {
        this.push(chunk.toString().toUpperCase())

        next()
      }))
      .pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/new.output.fas'))
  }
)

// const concatTask = task({
//   input: '*.fas',
//   output: '*.fas',
//   params: {output: 'concat.fas'}
// }, ( object ) => {
//   console.log('input_directory: ', object.dir)
//   console.log('input_variable: ', object, object.params)
//   return `cat ${object.input.join(' ')} > ${object.params.output}`
//   }
// )


// const pipeline = join(myTask, concatTask)

// pipeline()

// myTask()
// myTask1()
// myTask2()

const pipeline = join(myTask, junction( myTask1, myTask2))

pipeline()