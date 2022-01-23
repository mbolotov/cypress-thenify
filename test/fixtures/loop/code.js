it('asdf', () => {
    let a = []
    for (var i = 0; i < 1; i++) {
        a.push(cy.wrap("asdf").thenify())
    }
    cy.thenify()
    console.log(JSON.stringify(a))
});
