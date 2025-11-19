// Import commands
import './commands'

// Global beforeEach
beforeEach(() => {
  // Clear localStorage
  cy.clearLocalStorage()
  
  // Clear all cookies
  cy.clearCookies()
  
  // Mock localStorage
  cy.window().then((win) => {
    win.localStorage.setItem = cy.stub()
    win.localStorage.getItem = cy.stub()
    win.localStorage.removeItem = cy.stub()
    win.localStorage.clear = cy.stub()
  })
})
