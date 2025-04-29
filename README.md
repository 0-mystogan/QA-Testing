# QA-Testing
Restful Booker API Testing Project

This project contains automated tests for the Restful Booker API service using Cypress.


## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Install Cypress (if not already installed):
```bash
npm install cypress --save-dev
```

## Running the Tests

### Running Tests in Cypress Test Runner (GUI Mode)

1. Open Cypress Test Runner:
```bash
npx cypress open
```

2. Select "E2E Testing"
3. Choose your preferred browser (Chrome, Firefox, or Electron)
4. Click on the test file you want to run from the list

### Running Tests from Command Line

1. Run all tests:
```bash
npx cypress run
```

2. Run specific test file:
```bash
npx cypress run --spec "cypress/e2e/booking_api_scenarios.cy.js"
```

3. Run tests in specific browser:
```bash
npx cypress run --browser chrome
```

## Test Files Description

- `booking_api_test_case.cy.js`: Basic user test case CRUD operations
- `booking_api_scenarios.cy.js`: Contains positive and negative test scenarios for the booking API
- `api_smoke_test.cy.js`: Basic smoke tests for API endpoints

## Test Categories

1. **Positive Scenarios**:
   - Create booking with valid data
   - Get booking details
   - Update booking
   - Delete booking

2. **Negative Scenarios**:
   - Invalid token tests
   - Invalid date formats
   - Wrong data types
   - Missing required fields

## Expected Status Codes

- 200: Successful request
- 400: Bad Request (invalid data format, wrong data types)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (invalid token, no permission)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (server-side issues)

## API Documentation

The tests are written against the Restful Booker API:
- Base URL: https://restful-booker.herokuapp.com
- Documentation: https://restful-booker.herokuapp.com/apidoc/index.html

