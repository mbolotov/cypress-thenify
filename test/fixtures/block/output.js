it('asdf', () => {
  let myValue;

  if (true) {
    cy.wrap("foo").then(__cypressSyncVar__ => {
      myValue = __cypressSyncVar__;
      console.log(myValue); // will print 'foo' as we are inside the same block of code as the `thenify` call
    });
  } else {
    myValue = "bar";
  }

  console.log(myValue); // will print `$Chainer...` as we are out of the initial block of code

  cy.then(__cypressSyncVar__ => {
    __cypressSyncVar__;
    console.log(myValue); // will print 'foo' again
  });
});
