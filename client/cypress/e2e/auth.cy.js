describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept('POST', '**/api/auth/login').as('loginRequest')
    cy.intercept('POST', '**/api/auth/signup').as('signupRequest')
    cy.intercept('GET', '**/api/auth/me').as('getUserRequest')
  })

  it('should navigate to login page', () => {
    cy.visit('/login')
    cy.contains('h2', 'Login').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
  })

  it('should show validation errors for empty form', () => {
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    
    cy.get('input[name="email"]').should('have.attr', 'required')
    cy.get('input[name="password"]').should('have.attr', 'required')
  })

  it('should login successfully with valid credentials', () => {
    cy.visit('/login')
    
    // Mock successful login response
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        status: 'success',
        token: 'mock-jwt-token',
        data: {
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      }
    }).as('loginSuccess')

    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginSuccess')
    cy.url().should('include', '/')
    cy.contains('Welcome').should('be.visible')
  })

  it('should show error message with invalid credentials', () => {
    cy.visit('/login')
    
    // Mock failed login response
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'Incorrect email or password'
      }
    }).as('loginFail')

    cy.get('input[name="email"]').type('wrong@example.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginFail')
    cy.contains('Incorrect email or password').should('be.visible')
  })

  it('should navigate to signup page', () => {
    cy.visit('/login')
    cy.contains("Don't have an account?").click()
    cy.url().should('include', '/signup')
  })
})
