describe('Restful Booker API Testing', () => {

    let bookingId; // we'll store the booking ID here

    it('Create a new booking (POST)', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: {
                firstname: 'John',
                lastname: 'Doe',
                totalprice: 150,
                depositpaid: true,
                bookingdates: {
                    checkin: '2025-05-01',
                    checkout: '2025-05-10'
                },
                additionalneeds: 'Breakfast'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('bookingid');
            expect(response.body.booking).to.have.property('firstname', 'John');

            bookingId = response.body.bookingid; // save bookingId for later
        });
    });

    it('Get a booking (GET)', () => {
        cy.request(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('firstname', 'John');
            });
    });

    it('Update the booking (PUT)', () => {
        // First, you need a token to update bookings
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                username: 'admin',
                password: 'password123'
            }
        }).then((authResponse) => {
            const token = authResponse.body.token;

            cy.request({
                method: 'PUT',
                url: `https://restful-booker.herokuapp.com/booking/${654}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': `token=${token}`
                },
                body: {
                    firstname: 'Jane',
                    lastname: 'Doe',
                    totalprice: 200,
                    depositpaid: false,
                    bookingdates: {
                        checkin: '2025-06-01',
                        checkout: '2025-06-10'
                    },
                    additionalneeds: 'Lunch'
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.firstname).to.eq('Jane');
            });
        });
    });

    it('Delete the booking (DELETE)', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                username: 'admin',
                password: 'password123'
            }
        }).then((authResponse) => {
            const token = authResponse.body.token;

            cy.request({
                method: 'DELETE',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Cookie': `token=${token}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201); // 201 means Deleted
            });
        });
    });

});
