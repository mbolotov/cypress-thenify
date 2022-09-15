it('asdf', () => {
  cy.get(".new-todo").invoke("val").then(__cypressSyncVar__ => {
    let a = __cypressSyncVar__;
    cy.log(a);
    cy.then(() => {});
  });
  cy.then(() => {});
});