const request = require("supertest");
const { app, server } = require("../index");
const { getAuthToken } = require("./helpers/testHelpers");
const db = require("../config");

describe("Transaction routes", () => {
  const routeAll = "/api/v1/transactions";
  const routeSingle = "/api/v1/transactions/transaction/";

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
        returned_date: "",
      };

      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send(transaction);

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("Transaction created");
    });

    it("should return an error if data is missing", async () => {
      const reservation = {
        item_id: "TEST123",
        item_name: "Box",
        user_id: "USER123",
        // transaction_status: "On Loan",
        loan_date: db.CurrentTime,
        // Missing due date & returned date & transaction status
      };

      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send(reservation);

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Missing required fields");
    });
  });

  describe("GET /api/v1/transactions", () => {
    it("should return all transactions", async () => {
      const response = await request(app)
        .get(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("item_id");
      expect(response.body[0]).toHaveProperty("item_name");
      expect(response.body[0]).toHaveProperty("user_id");
      expect(response.body[0]).toHaveProperty("transaction_status");
      expect(response.body[0]).toHaveProperty("loan_date");
      expect(response.body[0]).toHaveProperty("due_date");
      expect(response.body[0]).toHaveProperty("returned_date");
    });

    it("should require authentication", async () => {
      const response = await request(app).get(routeAll).expect(401);

      expect(response.body.msg).toEqual("Unauthorised");
    });
  });

  describe("GET /api/v1/transactions/transaction/", () => {
    it("should return a reservation document with the specified ID", async () => {
      const transactionId = "abc123"; // Example transaction ID

      // Mock database call to return sample transaction document
      const response = {
        item_id: transactionId,
        item_name: "Box",
        user_id: "User123",
        transaction_status: "On Loan",
        loan_date: "2023-03-21T23:19:13.393Z",
        due_date: "2023-03-14T23:19:13.393Z",
        returned_date: "2023-03-14T23:19:13.393Z",
      };

      // Mock Firestore database instance and method
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue(response),
        }),
      };
      db.Transactions.doc = jest.fn().mockReturnValue(mockDocRef);

      // Make GET request to route handler function
      const res = await request(app)
        .get(routeSingle + transactionId)
        .set("Authorization", `Bearer ${authToken}`);

      // Assert that the response contains the expected transaction data
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(response);
      expect(db.Transactions.doc).toHaveBeenCalledWith(transactionId);
    });

    it("should require authentication", async () => {
      const transactionId = "abc123"; // Example transaction ID

      const response = await request(app)
        .get(routeSingle + transactionId)
        .expect(401);

      expect(response.body.msg).toEqual("Unauthorised");
    });
  });

  describe("PATCH /api/v1/transaction/:id", () => {
    const transactionId = "abc123"; // Example transaction ID

    it("should update transaction", async () => {
      const updateTransaction = {
        transaction_status: "Returned",
      };

      db.Transactions.doc = jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue(),
      });

      const response = await request(app)
        .patch(routeSingle + transactionId)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateTransaction);

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("Transaction updated");
      expect(db.Transactions.doc).toHaveBeenCalledWith(transactionId);
      expect(db.Transactions.doc().update).toHaveBeenCalledWith({
        transaction_status: "Returned",
        returned_date: expect.anything(),
      });
    });
  });
});
