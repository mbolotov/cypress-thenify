describe('Cypress can be synchronous', () => {
    it('Forget "then" hell!', () => {
        cy.visit("https://todomvc.com/examples/react")
        cy.get(".new-todo").type("Cypress is a cool tool")

        let a = cy.get(".new-todo").invoke("val") // yes, you can assign the result of a Cypress command now!

        cy.log(a)
    })
})
