{
  "name": "mern-testing-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "test": "jest",
    "test:unit": "jest --testPathPattern=src/tests/unit",
    "test:integration": "jest --testPathPattern=src/tests/integration",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "jest": "^29.6.2",
    "jest-environment-jsdom": "^29.6.2",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/user-event": "^14.4.3",
    "@testing-library/dom": "^9.3.1",
    "cypress": "^12.17.4"
  }
}
