it('asdf', () => {
    let a = cy.get("asdf").thenify()
    cy.log(a)
    let b = cy.get("ghjk").thenify()
    cy.log(a)
    cy.log(b)
});
