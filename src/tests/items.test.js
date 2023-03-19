const request = require("supertest");
const { app, server } = require("../index");
const { getAuthToken } = require("./helpers/testHelpers");
const db = require("../config");
const sharp = require("sharp");
const fs = require("fs");

jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readdirSync: jest.fn(),
  unlink: jest.fn().mockResolvedValue(),
  unlinkSync: jest.fn(),
}));

jest.mock("../middleware/middlewareFile", () =>
jest.fn().mockImplementation((req, res, next) => {
  req.file = {
    originalname: "test-image.jpg",
    mimetype: "image/jpeg",
    path: "/tmp/test.jpg",
  };
  next();
})
);

describe("Item routes", () => {
  const routeAll = "/api/v1/items";
  const routeSingle = "/api/v1/items/item/";
  let authToken;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /items", () => {


    let sharpToSpy, bucketUploadMock;

    const mockFile = {
      path: "./uploads/test-image.jpg",
      fieldname: "image",
      originalname: "test-image.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: Buffer.from("test image buffer"),
      size: 1234,
    };

    beforeEach(() => {
      sharpToSpy = jest.spyOn(sharp.prototype, "toFile").mockResolvedValue();
      bucketUploadMock = jest.fn().mockResolvedValue([
        {
          metadata: {
            mediaLink: "https://example.com/image.jpg",
          },
        },
      ]);
      db.bucket.upload = bucketUploadMock;


    });

    afterEach(() => {
      sharpToSpy.mockRestore();
    });

    it("should add a new item", async () => {
      // Create a mock function for db.Items.add
      db.Items.add = jest.fn().mockReturnValue();

      const blob = new Blob([mockFile.buffer], {
        type: mockFile.mimetype,
      });

      const formData = new FormData();
      formData.append("image", blob, {
        filename: mockFile.originalname,
        contentType: mockFile.mimetype,
      });

      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          item_name: "Test Item",
          item_type: "Test Type",
          description: "Test Description",
          status: "available",
          imageUrl: "https://example.com/image.jpg",
          formData,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("Item Added");

      // Check that the item was added to the database with the correct data
      expect(db.Items.add).toHaveBeenCalledWith({
        item_name: "Test Item",
        item_type: "Test Type",
        description: "Test Description",
        status: "available",
        imageUrl: "https://example.com/image.jpg",
      });

      // Check that the file was uploaded to storage with the correct metadata
      expect(bucketUploadMock).toHaveBeenCalledWith(
        `./uploads/thumb_${mockFile.originalname}`,
        {
          destination: expect.stringContaining("images/"),
          metadata: {
            contentType: mockFile.mimetype,
          },
        }
      );
    });
    it("should return an error if required data is missing", async () => {
      const response = await request(app)
        .post(routeAll)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          // missing item name and type
          description: "Test Description",
          status: "available",
          formData: new FormData(),
        });
    
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Item name and type are required");
    });
  });
  describe('GET /api/v1/items', () => {
  
    it('should return all items', async () => {
      const response = await request(app)
        .get(routeAll)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('item_name');
      expect(response.body[0]).toHaveProperty('item_type');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('imageUrl');
    });
  });

  describe("GET /api/v1/items/item/", () => {
    it("should return a item with the specified ID", async () => {
      const itemId = "abc123"; // Example item ID
  
      // Mock database call to return sample transaction document
      const response = {
        item_name: "Box",
        item_type: "Storage",
        description: "Cardboard",
        status: "Reserved",
        imageUrl: "https://example.com/image.jpg",
      };
   
          // Mock Firestore database instance and method
          const mockDocRef = {
            get: jest.fn().mockResolvedValue({
              data: jest.fn().mockReturnValue(response)
            })
          };
          db.Items.doc = jest.fn().mockReturnValue(mockDocRef);
  
      // Make GET request to route handler function
      const res = await request(app)
        .get(routeSingle + itemId)
        .set("Authorization", `Bearer ${authToken}`);

        // Assert that the response contains the expected transaction data
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(response);
      expect(db.Items.doc).toHaveBeenCalledWith(itemId);
    });
  })
  describe("DELETE /api/v1/items/item/", () => {
    it("should delete a reservation document with the specified ID and return a success message", async () => {
      const itemId = "abc123"; // Example item ID
  
      // Mock database call to delete sample reservation document
      const deleteMock = jest.fn().mockResolvedValue();
      db.Items.doc = jest.fn().mockReturnValue({ delete: deleteMock });
  
      // Make DELETE request to route handler function
      const res = await request(app)
        .delete(routeSingle + itemId)
        .set("Authorization", `Bearer ${authToken}`);
  
      // Assert that the response contains the success message
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ msg: "Item deleted" });
  
      // Assert that the mock delete function was called with the correct item ID
      expect(db.Items.doc).toHaveBeenCalledWith(itemId);
      expect(deleteMock).toHaveBeenCalled();
    });
  
    it("should return an error message when an unauthorized request is made", async () => {
      const itemId = "abc123"; // Example reservation ID
  
      // Make DELETE request to route handler function without providing authentication token
      const res = await request(app).delete(routeSingle + itemId);
  
      // Assert that the response contains the error message
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ msg: "Unauthorised" });
    });
  });


});
