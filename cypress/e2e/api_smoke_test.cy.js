describe('API Smoke Tests', () => {
    it('should verify API health check', () => {
        cy.request('https://restful-booker.herokuapp.com/ping')
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.eq('Created');
            });
    });

    it('should get all bookings', () => {
        cy.request('https://restful-booker.herokuapp.com/booking')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.greaterThan(0);
            });
    });

    it('should create and verify a new booking', () => {
        const bookingData = {
            firstname: 'Test',
            lastname: 'User',
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: '2024-05-01',
                checkout: '2024-05-05'
            },
            additionalneeds: 'Breakfast'
        };

        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: bookingData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.booking).to.deep.include(bookingData);
            
            // Verify the created booking
            const bookingId = response.body.bookingid;
            cy.request(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
                .then((getResponse) => {
                    expect(getResponse.status).to.eq(200);
                    expect(getResponse.body).to.deep.include(bookingData);
                });
        });
    });
}); 