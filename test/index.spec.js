const pluginTester = require('babel-plugin-tester');

const plugin =  require('..');

const path = require('path');

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
  pluginOptions: {
    // thenify_function_name: 'cyEval',
  },
})

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixturesTotal'),
  pluginOptions: {
    total_thenify: 'true',
  },
})
