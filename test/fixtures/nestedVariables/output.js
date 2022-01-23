it('asdf', () => {
  cy.get("asdf").then(__cypressSyncVar__ => {
    let a = __cypressSyncVar__;
    cy.log(a);
    cy.get("ghjk").then(__cypressSyncVar__ => {
      let b = __cypressSyncVar__;
      cy.log(a);
      cy.log(b);
    });
  });
});
