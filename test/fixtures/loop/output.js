it('asdf', () => {
  let a = [];

  for (var i = 0; i < 1; i++) {
    cy.wrap("asdf").then(__cypressSyncVar__ => {
      a.push(__cypressSyncVar__);
    });
  }

  cy.then(__cypressSyncVar__ => {
    __cypressSyncVar__;
    console.log(JSON.stringify(a));
  });
});
