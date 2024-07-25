describe('Login view', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Has the desired page title', () => {
    cy.title().should('include', 'ccshipadmin')
  })

  it('Visits the Login view and find an instructional message to log in', () => {
    cy.get('p').contains('Please login to access content')
  })
})
