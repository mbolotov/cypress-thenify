const pluginTester = require('babel-plugin-tester');

const plugin =  require('..');

const path = require('path');
console.log()

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
  pluginOptions: {
    // thenify_function_name: 'cyEval',
  },
})
