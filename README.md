# cypress-thenify

## Rationale
Cypress commands are asynchronous. It's a common pattern to use a `then` callback to get the value of a cypress command. 

However, any callback, especially nested one, makes the code less readable.

This plugin allows wrapping a cypress command call statement into a `then` callback under the hood and keep your code clean and readable. 

                        
## Usage example
### Strict mode (the default mode): 
Given code
```js
    let a = cy.get("foo").thenify()
    cy.log(a.text())
    let b = cy.get("bar").thenify()
    cy.log(a.text())
    b.click() // using jQuery click method
```
will be transpiled into this one:
```js
  cy.get("foo").then(__cypressSyncVar__ => {
    let a = __cypressSyncVar__;
    cy.log(a.text());
    cy.get("bar").then(__cypressSyncVar__ => {
      let b = __cypressSyncVar__;
      cy.log(a.text());
      b.click(); // using jQuery click method
    });
  });
```
### Total mode:
In this mode, the plugin will thenify all the `cy` statements. To enable this mode, use `total_thenify = 'true'` option, see [Plugin options](#plugin-options) section for details.

Given code
```js
    let a = cy.get("foo")
    cy.log(a.text())
    let b = cy.get("bar")
    cy.log(a.text())
    b.click() // using jQuery click method
```
will be transpiled into this one:
```js
cy.get("foo").then(__cypressSyncVar__ => {
   let a = __cypressSyncVar__;
   cy.log(a.text());
   cy.then(() => {
      cy.get("bar").then(__cypressSyncVar__ => {
         let b = __cypressSyncVar__;
         cy.log(a.text());
         cy.then(() => {
            b.click(); // using jQuery click method
         });
      });
   });
});
```


## Limitations
1. Only a single `thenify` call per statement is currently supported. So 
```js
 let a = cy.wrap(1).thenify() + cy.wrap(2).thenify()
 ``` 
  will produce an error.

2. [Strict mode] The plugin wraps statements inside the current block of statements only. Use an empty call to `cy.thenify()` to 'synchronize' the execution context with the cypress event loop:
```js
   let myValue 
   if (myCondition) { // suppose myCondition is true
       myValue = cy.wrap("foo").thenify()
       someOtherCode()
       console.log(myValue) // will print 'foo' as we are inside the same block of code as the `thenify` call
   } else {
       myValue = "bar"
   }
   console.log(myValue) // will print `undefined` as we are out of the initial block of code 
   cy.thenify()
   console.log(myValue) // will print 'foo' as we get in sync with the cypress event loop 
                        // because this and all below statements of the current block will be executed under a `then` callback   
``` 
                                    
3. [Strict mode] The plugin searches for the `thenify` call only by its name, no deep semantic analysis is performed. So it will transpile any of `myObj.thenify()` calls.
Use the plugin options to define your own unique function name if this default name clashes with any of your existing function (see `Plugin options` section).     
 
## Install and configure
```shell 
npm i cypress-thenify -D
```
After that, we need to add this plugin as a babel plugin for Cypress. 

Put this into your `plugin/index.js` if you have Cypress < 10 version:
```js
const thenify = require("cypress-thenify")
const webpackPreprocessor = require('@cypress/webpack-preprocessor')

module.exports = (on) => {
    const options = webpackPreprocessor.defaultOptions
    options.webpackOptions.module.rules[0].use[0].options.plugins = [[thenify, { total_thenify: 'true' }]] // The 'Total' mode is enabled
    on('file:preprocessor', webpackPreprocessor(options))
}
```
Or put this into your `setupNodeEvents` within the configuration file if you have Cypress >= 10 version:
```js
        setupNodeEvents(on, config) {
            const thenify = require("cypress-thenify")
            const webpackPreprocessor = require('@cypress/webpack-preprocessor')
            const options = webpackPreprocessor.defaultOptions
            options.webpackOptions.module.rules[0].use[0].options.plugins = [[thenify, { total_thenify: 'true' }]] // The 'Total' mode is enabled
            on('file:preprocessor', webpackPreprocessor(options))
        },
```

## Plugin options
You can define a custom `thenify` function name by passing options to the plugin:
```js
  options.webpackOptions.module.rules[0].use[0].options.plugins = [[thenify, { thenify_function_name: 'cyEval'}]] 
```

## Project status notice
This project is in alpha stage. Some bugs are highly likely to be found. Please report any issues or suggestions into the [tracker](https://github.com/mbolotov/cypress-thenify/issues)

## Ad
If you use IDEA, Webstorm or any other IntelliJ IDEs to develop your Cypress tests, please consider using [Cypress Support](https://plugins.jetbrains.com/plugin/13819-cypress-support) or [Cypress Support Pro](https://plugins.jetbrains.com/plugin/13987-cypress-support-pro) plugins to increase your productivity.

