it('asdf', () => {
    let a = cy.get("foo")
    cy.log(a.text())
    let b = cy.get("bar")
    cy.log(a.text())
    b.click() // using jQuery click method
})
