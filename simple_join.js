'use strict'

// === WATERMILL ===
const {
  task,
  join
} = require('bionode-watermill')

// this is a kiss example of how tasks work with shell
const simpleTask = task({
  output: '*.fas', // checks if output file matches the specified pattern
  params: 'test_file.fas',  //defines parameters to be passed to the
    // task function
    name: 'This is the task name' //defines the name of the task
  }, ({ params }) => `touch ${params}`
)

const writeToFile = task({
  input: '*.fas', // specifies the pattern of the expected input
  output: '*.fas', // checks if output file matches the specified pattern
  name: 'Write to file' //defines the name of the task
}, ({ input }) => `echo "some string" >> ${input}`
)

// this is a kiss example of how join works
const pipeline = join(simpleTask, writeToFile)

//executes the join itself
pipeline()