const db = require("../config");

const Users = {
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue()
};

db.Users = Users;

module.exports = {
  db
};

// const mockFirestore = () => {
//   const mockFirestore = {
//     doc: jest.fn(() => mockDoc),
//   };

//   const mockDoc = {
//     set: jest.fn(),
//   };

//   return mockFirestore;
// };

// dbMock.Users = mockFirestore();

// module.exports = {
//   dbMock,
// };


// jest.mock("../config", () => ({
//   Users: {
//     doc: jest.fn(() => ({
//       set: jest.fn(() => Promise.resolve()),
//     })),
//   },
// }));

// module.exports = {
//   db,
// };
