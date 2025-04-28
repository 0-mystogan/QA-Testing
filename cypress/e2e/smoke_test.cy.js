describe('Restful Booker API Smoke Test', () => {

    it('Check if server is alive (PING)', () => {
        cy.request('https://restful-booker.herokuapp.com/ping')
            .then((response) => {
                expect(response.status).to.eq(201);
            });
    });

    it('Check if authentication works', () => {
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
        });
    });

    it('Check if booking creation works', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: {
                firstname: 'Smoke',
                lastname: 'Test',
                totalprice: 100,
                depositpaid: true,
                bookingdates: {
                    checkin: '2025-01-01',
                    checkout: '2025-01-05'
                },
                additionalneeds: 'Breakfast'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('bookingid');
        });
    });

});
