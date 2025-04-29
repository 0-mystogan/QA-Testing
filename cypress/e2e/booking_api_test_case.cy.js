describe('Restful Booker API Testing', () => {
    let bookingId;
    let authToken;

    // Test data
    const bookingData = {
        firstname: 'Jasir',
        lastname: 'Buric',
        totalprice: 166,
        depositpaid: true,
        bookingdates: {
            checkin: '2025-05-01',
            checkout: '2025-05-10'
        },
        additionalneeds: 'Breakfast'
    };

    const updatedBookingData = {
        ...bookingData,
        totalprice: 233,
        depositpaid: false,
        bookingdates: {
            checkin: '2025-06-01',
            checkout: '2025-06-10'
        },
        additionalneeds: 'Lunch'
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

    it('should create a new booking successfully', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: bookingData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // Verify response status
            expect(response.status).to.eq(200);
            
            // Verify response structure
            expect(response.body).to.have.property('bookingid');
            expect(response.body).to.have.property('booking');
            
            // Verify booking details
            expect(response.body.booking).to.deep.include(bookingData);
            
            // Store booking ID for subsequent tests
            bookingId = response.body.bookingid;
        });
    });

    it('should retrieve the created booking', () => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            failOnStatusCode: false
        }).then((response) => {
            // Verify response status
            expect(response.status).to.eq(200);
            
            // Verify booking details
            expect(response.body).to.deep.include(bookingData);
        });
    });

    it('should update the booking successfully', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${authToken}`
            },
            body: updatedBookingData,
            failOnStatusCode: false
        }).then((response) => {
            // Verify response status
            expect(response.status).to.eq(200);
            
            // Verify updated booking details
            expect(response.body).to.deep.include(updatedBookingData);
        });
    });

    it('should delete the booking successfully', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            headers: {
                'Cookie': `token=${authToken}`
            },
            failOnStatusCode: false
        }).then((response) => {
            // Verify deletion was successful
            expect(response.status).to.eq(201);
            
            // Verify booking is actually deleted
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(404);
            });
        });
    });
});
