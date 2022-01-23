it('asdf', () => {
    let myValue
    if (true) {
        myValue = cy.wrap("foo").thenify()
        console.log(myValue) // will print 'foo' as we are inside the same block of code as the `thenify` call
    } else {
        myValue = "bar"
    }
    console.log(myValue) // will print `$Chainer...` as we are out of the initial block of code
    cy.thenify()
    console.log(myValue) // will print 'foo' again
})
