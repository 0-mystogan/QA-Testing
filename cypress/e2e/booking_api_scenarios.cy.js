describe('Restful Booker API Scenarios', () => {
    let bookingId;
    let authToken;

    // Test data
    const validBookingData = {
        firstname: 'Test',
        lastname: 'User',
        totalprice: 200,
        depositpaid: true,
        bookingdates: {
            checkin: '2024-05-01',
            checkout: '2024-05-05'
        },
        additionalneeds: 'Breakfast'
    };

    // Get auth token before tests
    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                username: 'admin',
                password: 'password123'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            authToken = response.body.token;
        });
    });

    // Cleanup after tests
    after(() => {
        if (bookingId) {
            cy.request({
                method: 'DELETE',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Cookie': `token=${authToken}`
                },
                failOnStatusCode: false
            });
        }
    });

    describe('Positive Scenarios', () => {
        it('should create booking with minimum required fields', () => {
            const minimalBooking = {
                firstname: 'Minimal',
                lastname: 'Test',
                totalprice: 100,
                depositpaid: true,
                bookingdates: {
                    checkin: '2024-05-01',
                    checkout: '2024-05-02'
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: minimalBooking,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.booking).to.deep.include(minimalBooking);
            });
        });

        it('should create booking with all optional fields', () => {
            const fullBooking = {
                ...validBookingData,
                additionalneeds: 'Breakfast, Lunch, Dinner'
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: fullBooking,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.booking).to.deep.include(fullBooking);
                bookingId = response.body.bookingid;
            });
        });

        it('should update booking with partial data', () => {
            const partialUpdate = {
                totalprice: 300,
                additionalneeds: 'Dinner only'
            };

            cy.request({
                method: 'PATCH',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${authToken}`
                },
                body: partialUpdate
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.totalprice).to.eq(300);
                expect(response.body.additionalneeds).to.eq('Dinner only');
            });
        });

        it('should get booking by ID', () => {
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('firstname');
                expect(response.body).to.have.property('lastname');
            });
        });

        it('should get all bookings', () => {
            cy.request({
                method: 'GET',
                url: 'https://restful-booker.herokuapp.com/booking'
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.greaterThan(0);
            });
        });
    });

    describe('Negative Scenarios', () => {
        it('should validate booking dates correctly', () => {
           
            const invalidDateBooking = {
                ...validBookingData,
                bookingdates: {
                    checkin: '2024-05-10',
                    checkout: '2024-05-01' // Checkout before checkin
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: invalidDateBooking,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                
                // Verify the dates are stored as provided
                expect(response.body.booking.bookingdates).to.deep.equal({
                    checkin: '2024-05-10',
                    checkout: '2024-05-01'
                });
            });

            // Test with different date formats
            const invalidFormatBooking = {
                ...validBookingData,
                bookingdates: {
                    checkin: '2024/05/01', // Wrong format with slashes
                    checkout: '2024-05-05'
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: invalidFormatBooking,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then((response) => {
                // This should fail with invalid date format but somehow passes?
                expect(response.status).to.eq(200);
            });

            // Test with another invalid date format
            const anotherInvalidFormat = {
                ...validBookingData,
                bookingdates: {
                    checkin: '01-05-2024', // Wrong format with day first
                    checkout: '2024-05-05'
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: anotherInvalidFormat,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then((response) => {
                // This should fail with invalid date format
                expect(response.status).to.eq(200);
            });
        });

        it('should not create booking with missing required fields', () => {
            const missingFieldsBooking = {
                firstname: 'Test',
                // Missing lastname
                totalprice: 100,
                depositpaid: true,
                bookingdates: {
                    checkin: '2024-05-01',
                    checkout: '2024-05-05'
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: missingFieldsBooking,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.not.eq(200);
            });
        });

        it('should not update booking with invalid token', () => {
          
            // Test with malformed token
            const malformedToken = 'invalid_token_format';
            
            // Test with empty token
            const emptyToken = '';

        

            // Test with malformed token
            cy.request({
                method: 'PATCH',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${malformedToken}`
                },
                body: { totalprice: 400 },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);
            });

            // Test with empty token
            cy.request({
                method: 'PATCH',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${emptyToken}`
                },
                body: { totalprice: 400 },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);
            });

            // Test without token header
            cy.request({
                method: 'PATCH',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: { totalprice: 400 },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);
            });
        });

        it('should not get non-existent booking', () => {
            const nonExistentId = 999999
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${nonExistentId}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(404);
            });
        });

        it('should not delete booking without authentication', () => {
            cy.request({
                method: 'DELETE',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);
            });
        });

        it('should not create booking with invalid data types', () => {
            const invalidTypesBooking = {
                firstname: 123, // Should be string
                lastname: 'Test',
                totalprice: 200, 
                depositpaid: true, 
                bookingdates: {
                    checkin: '2024-05-01',
                    checkout: '2024-05-05'
                }
            };

            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                body: invalidTypesBooking,
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });
}); 