const request = require("supertest");
const app = require("../index");
const { getAuthToken } = require('./helpers/testHelpers');
// const { db } = require("./mocks");

describe('User routes', () => {

  const routeAll = "/api/v1/users"
  const routeSingle = "/api/v1/users/user/"

  let authToken;
  

  beforeAll(async () => {
    authToken = await getAuthToken();
  });


  describe('GET /api/v1/users', () => {
  
    it('should return all users', async () => {
      const response = await request(app)
        .get(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('first_name');
      expect(response.body[0]).toHaveProperty('last_name');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('address');
      expect(response.body[0]).toHaveProperty('admin');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(routeAll)
        .expect(401);

      expect(response.body.msg).toEqual('Unauthorised');
    });
  });

  describe('GET /api/v1/users/user', () => {

    const userId = 'QObSxxu1i7f7j5ldZCE8YLLCp9y1';
  
    it('should return a sinbgle user record', async () => {
      const response = await request(app)
        .get(routeSingle + userId)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('admin');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(routeSingle + userId)
        .expect(401);

      expect(response.body.msg).toEqual('Unauthorised');
    });
  });

  describe("POST /create-user", () => {
    it("should create a new user", async () => {
      const user = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        address: "123 Main St",
        id: "user123",
        admin: false
      };

      const response = await request(app)
        .post(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
        .send(user);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("User Added");
    });

    it("should return an error if data is missing", async () => {
      const user = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        // Missing address and id
      };
  
      const response = await request(app)
        .post(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
        .send(user);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toContain("Missing");
    });
  });

  describe("PATCH /update-user/:id", () => {
    const testUserID = 'user123'
    it("should create a new user", async () => {
      const updatedUser = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe@test.com',
        address: '456 Elm St',
        admin: true
    };

      const response = await request(app)
        .patch(routeSingle + testUserID)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedUser);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("User updated");
    });

    it("should return an error if data is missing", async () => {
      const updatedUser = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe@test.com',
        address: '456 Elm St',
        admin: true
    };
  
      const response = await request(app)
        .patch(routeSingle + '123')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedUser);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).not.toBe('');
    });
  });

  
  describe("DELETE /delete-user/:id", () => {
    const testUserID = 'user123'
    it("should delete a user", async () => {


      const response = await request(app)
        .delete(routeSingle + testUserID)
        .set('Authorization', `Bearer ${authToken}`)
        // .send(updatedUser);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("User deleted");
    });

    it("should return an error if username is wrong", async () => {
  
      const response = await request(app)
        .delete(routeSingle + '123')
        .set('Authorization', `Bearer ${authToken}`)
        // .send(updatedUser);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).not.toBe('');
    });
  });
  

});