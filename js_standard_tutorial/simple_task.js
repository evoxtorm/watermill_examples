'use strict'

// === WATERMILL ===
//const task = require ('../../..').task
const watermill = require('bionode-watermill')
const task = watermill.task

// this is a kiss example of how tasks work with shell
const simpleTask = task({
  output: '*.fas', // checks if output file matches the specified pattern
  params: 'test_file.fas',  //defines parameters to be passed to the
    // task function
  name: 'This is the task name' //defines the name of the task
}, function(resolvedProps) {
    const params = resolvedProps.params
    return 'touch ' + params
  }
)

// runs the task and returns a promise, and can also return a callback
simpleTask()


