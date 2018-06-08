'use strict'


const { task } = require('bionode-watermill')


const fs = require('fs')
const through = require('through2')


const firstTask = task({
	input: '*.input.txt',
	output: '*.out.txt',
	name: 'UpperCase'
}, ({ input }) => {
	fs.createReadStream(input)
	.pipe(through(function (chunk, enc, next) {
		this.push(chunk.toString().toUpperCase())

		next()
	}))
	.pipe(fs.createWriteStream(input.split('/').slice(0, -1).join('/') + '/alphabet.out.txt'))
  }
)

firstTask()