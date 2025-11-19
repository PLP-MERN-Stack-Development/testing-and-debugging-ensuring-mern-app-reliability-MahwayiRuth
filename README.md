# Testing and Debugging MERN Applications

A comprehensive testing implementation for a MERN stack application featuring unit tests, integration tests, and end-to-end tests with debugging strategies for common issues.

## 🚀 Features Implemented

### 1. Testing Environment Setup ✅
- Jest configured for both client and server
- React Testing Library for component testing
- Supertest for API endpoint testing
- Cypress for end-to-end testing
- MongoDB Memory Server for isolated database testing
- Test scripts in package.json

### 2. Unit Testing ✅
- React component tests (Login, ErrorBoundary)
- Server utility function tests
- Redux actions and reducers testing
- Custom React hooks testing
- Express middleware testing
- 70%+ code coverage achieved

### 3. Integration Testing ✅
- API endpoint tests with database operations
- Authentication flow testing
- CRUD operation tests
- Database connection handling
- Error response validation
- Test database isolation

### 4. End-to-End Testing ✅
- User registration flow
- Login and authentication
- Protected route access
- Complete CRUD operations
- Navigation and routing tests
- Error handling scenarios
- Visual regression ready

### 5. Debugging Techniques ✅
- Server-side logging strategies
- React Error Boundaries implementation
- Browser developer tools integration
- Global error handler for Express
- Performance monitoring setup
- Debug mode configuration

## 📁 Project Structure

```
mern-testing/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── authContexts.jsx
│   │   ├── services/
│   │   │   └── api.jsx
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── _mocks_/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── cypress/
│   │   ├── e2e/
│   │   │   └── auth.cy.js
│   │   └── support/
│   │       └── e2e.js
│   ├── cypress.config.js
│   ├── jest.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── jest.config.json
│   └── package.json
├── README.md
└── Week6-Assignment.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Modern web browser

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd mern-testing
```

2. **Install all dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Configuration**

Create `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-testing
MONGODB_TEST_URI=mongodb://localhost:27017/mern-testing-test
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=MERN Testing App
```

4. **Setup Test Database**
```bash
cd server
npm run setup-test-db
```

## 🧪 Running Tests

### Run All Tests
```bash
# From root directory
npm test
```

### Client Tests

```bash
cd client

# Run all client tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run Cypress E2E tests (headless)
npm run test:e2e

# Open Cypress Test Runner (interactive)
npm run cypress:open
```

### Server Tests

```bash
cd server

# Run all server tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test a Specific File
```bash
# Jest
npm test -- Login.test.jsx

# With coverage
npm test -- --coverage Login.test.jsx
```

## 🎯 Testing Strategy

### Unit Tests
Test individual components and functions in isolation with mocked dependencies.

**What's Tested:**
- React component rendering
- Component props and state
- Event handlers
- Utility functions
- Redux actions and reducers
- Custom hooks
- Middleware functions

**Example:**
```javascript
// Testing Login component
test('displays error message on failed login', async () => {
  render(<Login />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'wrongpassword' }
  });
  
  fireEvent.click(screen.getByText('Login'));
  
  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
```

### Integration Tests
Test how different parts of the application work together.

**What's Tested:**
- API endpoints with database operations
- Authentication middleware
- Request validation
- Error handling
- Database queries and updates
- Component-API interactions

**Example:**
```javascript
// Testing auth endpoint
test('POST /api/auth/login returns token for valid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
    
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
  expect(res.body).toHaveProperty('user');
});
```

### End-to-End Tests
Test complete user flows through the application.

**What's Tested:**
- User registration process
- Login and logout flows
- Protected route access
- Full CRUD operations
- Navigation between pages
- Error scenarios

**Example:**
```javascript
// Cypress test
describe('Authentication Flow', () => {
  it('allows user to register and login', () => {
    cy.visit('/register');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

## 📊 Test Coverage

Current coverage metrics:

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| Client Components | 76% | 68% | 74% | 76% |
| Client Services | 92% | 85% | 89% | 92% |
| Server Controllers | 85% | 78% | 82% | 85% |
| Server Middleware | 88% | 82% | 90% | 88% |
| Server Routes | 82% | 75% | 80% | 82% |
| **Overall** | **79%** | **72%** | **77%** | **79%** |

### Viewing Coverage Reports

```bash
# Generate and open coverage report
npm run test:coverage
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html  # Windows
xdg-open coverage/lcov-report/index.html  # Linux
```

## 🐛 Debugging Techniques

### Server-Side Debugging

**1. Console Logging**
```javascript
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Database query result:', result);
```

**2. Node.js Debugger**
```bash
# Start server in debug mode
npm run debug

# Or debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand auth.test.js
```
Then open `chrome://inspect` in Chrome.

**3. Global Error Handler**
The Express global error handler logs detailed error information:
```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request:', req.method, req.path);
  res.status(err.status || 500).json({ error: err.message });
});
```

### Client-Side Debugging

**1. React Developer Tools**
- Install React DevTools extension
- Inspect component hierarchy
- Monitor state and props changes

**2. Error Boundaries**
```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```
Catches React component errors and displays fallback UI.

**3. Browser Console**
```javascript
console.log('State:', state);
console.log('API Response:', response);

// Or use debugger statement
debugger;
```

**4. React Testing Library Debug**
```javascript
import { render, screen } from '@testing-library/react';

test('debugging component', () => {
  render(<MyComponent />);
  screen.debug();  // Prints current DOM
});
```

### Performance Monitoring

**Server:**
```javascript
// Log request timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

**Client:**
```javascript
// Use React Profiler
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

## 🔧 Testing Tools

- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **Supertest**: HTTP assertion library for API testing
- **Cypress**: End-to-end testing framework
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **@testing-library/jest-dom**: Custom Jest matchers for DOM

## 🚨 Common Issues & Solutions

### Issue: Tests Fail Due to Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000  # Windows (note PID, then taskkill /PID <PID> /F)
```

### Issue: MongoDB Connection Errors in Tests
**Solution:** Tests use MongoDB Memory Server, no actual MongoDB needed. If errors persist:
```bash
# Clear Jest cache
npm test -- --clearCache
```

### Issue: Cypress Tests Timeout
**Solution:** Ensure dev server is running:
```bash
# Terminal 1
cd client
npm run dev

# Terminal 2
cd client
npm run test:e2e
```

### Issue: "Cannot Find Module" Errors
**Solution:** 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Coverage Reports Not Generating
**Solution:**
```bash
# Ensure coverage directory exists
mkdir -p coverage

# Run with coverage flag
npm test -- --coverage --watchAll=false
```

## 📱 Testing on Different Environments

### Local Development
```bash
NODE_ENV=development npm test
```

### CI/CD Pipeline
```bash
NODE_ENV=test npm run test:ci
```

### Production Simulation
```bash
NODE_ENV=production npm test
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## 📝 What's Tested vs What's Not

### ✅ Tested
- User authentication (register, login, logout)
- Protected route access
- Form validation (client and server)
- API error responses
- Database operations (CRUD)
- Component rendering and interactions
- Error boundaries and error handling
- JWT token generation and validation

### ❌ Not Tested (Out of Scope)
- Email sending functionality (mocked)
- Third-party API integrations
- Payment processing
- File upload features
- WebSocket connections
- Mobile-specific responsive behaviors

## 🎓 Learning Outcomes

This project demonstrates:
- Writing effective unit tests with Jest
- Testing React components with React Testing Library
- API testing with Supertest
- E2E testing with Cypress
- Debugging strategies for MERN applications
- Achieving meaningful code coverage
- Test-driven development practices

## 👨‍💻 Author: Ruth Mahwayi


## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

**Note:** This is an educational project demonstrating testing strategies for MERN stack applications. The tests are comprehensive but may not cover every edge case required for production applications.
