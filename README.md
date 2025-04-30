# QA-Testing
Restful Booker API Testing Project

This project contains automated tests for the Restful Booker API service using Cypress.

## Prerequisites

This project requires Node.js. If you don't have Node.js installed:
1. Download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Choose the LTS (Long Term Support) version for stability
3. Run the installer and follow the installation steps
4. Verify installation by running `node -v` in your terminal

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

- `booking_api_scenarios.cy.js`: 
  - Contains comprehensive test scenarios for the booking API
  - Includes both positive and negative test cases
  - Tests date validation, token validation, and data type validation
  - Note: With this test I found that you can send to server different format dates
    and send checkout before checkin (checkout: 2025-04-05 checkin: 2025-04-10). This case should not
    allow this kind of error!

- `booking_api_test_case.cy.js`:
  - Basic CRUD (Create, Read, Update, Delete) operations test
  - Tests the main booking functionality and imitate simple use case
  - Verifies successful creation, retrieval, updating, and deletion of bookings
  - Includes authentication flow testing

- `api_smoke_test.cy.js`:
  - Quick health check tests for the API and this is a software testing method that is used to determine if a new software build is ready for the next testing phase
  - Verifies basic API functionality
  - Tests if the API is up and running
  - Checks if main endpoints are accessible

## Expected Status Codes

- 200: Successful request
- 400: Bad Request (invalid data format, wrong data types)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (invalid token, no permission)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (server-side issues)

## Bugs that I found

   - API accepts checkout dates before checkin dates
   - API accepts various date formats without standardization
   - No validation for invalid dates (e.g., 2023-13-45)

## How to Fix Date Validation Issues

The date validation issues can be fixed by implementing proper validation on the server side

1. **Checkout Date Before Checkin Date**:
   - Add server-side validation to compare checkin and checkout dates
   - Return 400 Bad Request if checkout date is before or equal to checkin date

2. **Date Format Standardization**:
   - Enforce standard format (YYYY-MM-DD) for all dates
   - Add input validation to reject non-standard formats

3. **Invalid Date Validation**:
   - Add validation for invalid dates (e.g., 2021-13-45)
   - Check if the date is a valid calendar date

## Order in which tests should be run

1. **Smoke Tests** (`api_smoke_test.cy.js`)
   - Purpose: Verify basic API functionality and availability
   - When to run: Always run first to ensure API is operational
   - What it checks: API endpoints accessibility and basic responses

2. **Basic Use Case Tests** (`booking_api_test_case.cy.js`)
   - Purpose: Verify core booking functionality
   - When to run: After smoke tests pass
   - What it checks: CRUD operations and basic booking workflow

3. **Different Scenarios** (`booking_api_scenarios.cy.js`)
     - Positive test cases
     - Negative test cases
     - Date validation scenarios
     - Authentication scenarios
     - Error handling
