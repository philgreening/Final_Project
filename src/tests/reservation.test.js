const request = require("supertest");
const { app, server } = require("../index");
const { getAuthToken } = require("./helpers/testHelpers");
const db = require("../config");

describe("Reservation routes", () => {
  const routeAll = "/api/v1/reservations";
  const routeSingle = "/api/v1/reservations/reservation/";

  let authToken;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /api/v1/reservations", () => {
    db.Reservations.add = jest.fn().mockResolvedValue();

    it("should create a new user", async () => {
      const reservation = {
        id: 1,
        item_id: "Test123",
        item_name: "Test Item",
        user_id: "TestUser123",
      };

      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send(reservation);

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("Reservation created");
    });

    it("should return an error if data is missing", async () => {
      const reservation = {
        item_id: "Test123",
        item_name: "Test Item",
        // Missing user_id
      };

      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send(reservation);

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Missing required fields");
    });
  });

  describe("GET /api/v1/reservations", () => {
    it("should return all reservations", async () => {
      const response = await request(app)
        .get(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("item_id");
      expect(response.body[0]).toHaveProperty("item_name");
      expect(response.body[0]).toHaveProperty("user_id");
      expect(response.body[0]).toHaveProperty("res_date");
    });

    it("should require authentication", async () => {
      const response = await request(app).get(routeAll).expect(401);

      expect(response.body.msg).toEqual("Unauthorised");
    });
  });

  describe("GET /api/v1/reservations/reservation/", () => {
    it("should return a reservation document with the specified ID", async () => {
      const resId = "abc123"; // Example reservation ID

      // Mock database call to return sample reservation document
      const response = {
        item_id: resId,
        item_name: "Box",
        user_id: "User123",
        res_date: "2023-03-14T23:19:13.393Z",
      };

      // Mock Firestore database instance and method
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue(response),
        }),
      };
      db.Reservations.doc = jest.fn().mockReturnValue(mockDocRef);

      // Make GET request to route handler function
      const res = await request(app)
        .get(routeSingle + resId)
        .set("Authorization", `Bearer ${authToken}`);

      // Assert that the response contains the expected reservation data
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(response);
      expect(db.Reservations.doc).toHaveBeenCalledWith(resId);
    });

    it("should require authentication", async () => {
      const resId = "abc123"; // Example reservation ID

      const response = await request(app)
        .get(routeSingle + resId)
        .expect(401);

      expect(response.body.msg).toEqual("Unauthorised");
    });
  });

  describe("DELETE /api/v1/reservations/reservation/", () => {
    it("should delete a reservation document with the specified ID and return a success message", async () => {
      const resId = "abc123"; // Example reservation ID

      // Mock database call to delete sample reservation document
      const deleteMock = jest.fn().mockResolvedValue();
      db.Reservations.doc = jest.fn().mockReturnValue({ delete: deleteMock });

      // Make DELETE request to route handler function
      const res = await request(app)
        .delete(routeSingle + resId)
        .set("Authorization", `Bearer ${authToken}`);

      // Assert that the response contains the success message
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ msg: "Reservation deleted" });

      // Assert that the mock delete function was called with the correct reservation ID
      expect(db.Reservations.doc).toHaveBeenCalledWith(resId);
      expect(deleteMock).toHaveBeenCalled();
    });

    it("should return an error message when an unauthorized request is made", async () => {
      const resId = "abc123"; // Example reservation ID

      // Make DELETE request to route handler function without providing authentication token
      const res = await request(app).delete(routeSingle + resId);

      // Assert that the response contains the error message
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ msg: "Unauthorised" });
    });
  });
});
