const request = require("supertest");
const { app, server } = require("../index");
const { getAuthToken } = require('./helpers/testHelpers');
const db = require('../config')

describe('Transaction routes', () => {
    const routeAll = "/api/v1/transactions"
    const routeSingle = "/api/v1/transactions/transaction/"
  
    let authToken;
    
    beforeAll(async () => {
      authToken = await getAuthToken();
    });
  
    afterAll((done) => {
      server.close(done);
    });

    describe("POST /api/v1/transactions", () => {

        db.Transactions.add = jest.fn().mockResolvedValue();
    
        it("should create a new transaction", async () => {
          const transaction = {
            item_id: "TEST123",
            item_name: "Box",
            user_id: "USER123",
            transaction_status: "On Loan",
            loan_date: db.CurrentTime,
            due_date: db.FutureTime,
            returned_date: ""
          };

          const response = await request(app)
            .post(routeAll)
            .set('Authorization', `Bearer ${authToken}`)
            .send(transaction);
      
          expect(response.statusCode).toBe(200);
          expect(response.body.msg).toBe("Transaction created");
        });
    
        it("should return an error if data is missing", async () => {
          const reservation = {
            item_id: "TEST123",
            item_name: "Box",
            user_id: "USER123",
            transaction_status: "On Loan",
            loan_date: db.CurrentTime,
            // Missing due date & returbed date
          };
      
          const response = await request(app)
            .post(routeAll)
            .set('Authorization', `Bearer ${authToken}`)
            .send(reservation);
      
          expect(response.statusCode).toBe(400);
          expect(response.body.msg).toBe('Missing required fields');
        });
      });
});
