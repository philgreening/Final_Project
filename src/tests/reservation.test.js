const request = require("supertest");
const { app, server } = require("../index");
const { getAuthToken } = require('./helpers/testHelpers');
const db = require('../config')

describe('Reservation routes', () => {

    const routeAll = "/api/v1/reservations"
    const routeSingle = "/api/v1/reservations/reservation/"

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
        id:1,
        item_id: "Test123",
        item_name: "Test Item",
        user_id: "TestUser123",
      };

      const response = await request(app)
        .post(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send(reservation);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe('Missing required fields');
    });
  });

  describe('GET /api/v1/reservations', () => {
  
    it('should return all reservations', async () => {
      const response = await request(app)
        .get(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('item_id');
      expect(response.body[0]).toHaveProperty('item_name');
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('res_date');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(routeAll)
        .expect(401);

      expect(response.body.msg).toEqual('Unauthorised');
    });
  });

//   describe('GET /api/v1/users/user', () => {

//     const userId = 'QObSxxu1i7f7j5ldZCE8YLLCp9y1';
  
//     it('should return a single reservation', async () => {
//       const response = await request(app)
//         .get(routeSingle + userId)
//         .set('Authorization', `Bearer ${authToken}`)
//         .expect(200);

//         expect(response.body).toHaveProperty('item_id');
//         expect(response.body).toHaveProperty('item_name');
//         expect(response.body).toHaveProperty('user_id');
//         expect(response.body).toHaveProperty('res_date');
//     });

//     it('should require authentication', async () => {
//       const response = await request(app)
//         .get(routeSingle + userId)
//         .expect(401);

//       expect(response.body.msg).toEqual('Unauthorised');
//     });
//   });

});