'use strict'

const fs = require('fs')
const through = require('through2')

// === WATERMILL ===
const {
  task,
  join,
  junction,
  fork
} = require('bionode-watermill')

const concatTask = task({
  input: '*.fas',
  output: '*.fas',
  params: {output: 'concat.fas'}
}, ( object ) => {
  console.log('input_directory: ', object.dir)
  console.log('input_variable: ', object, object.params)
  return `cat ${object.input.join(' ')} > ${object.params.output}`
  }, ({ object }) => {
      fs.createReadStream(object)
      .pipe(through(function (chunk, enc, next) {
        this.push(chunk.toString().toUpperCase())

        next()
      }))
      .pipe(fs.createWriteStream(object.split('/').slice(0, -1).join('/') + '/new.concat.fas'))
  }
)


concatTask()

