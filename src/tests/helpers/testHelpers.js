const { auth } = require("../../config");
const axios = require("axios");

const uid = "QObSxxu1i7f7j5ldZCE8YLLCp9y1";

// Helper function to get Auth token for tests
const getAuthToken = async () => {
  const customToken = await auth.createCustomToken(uid);
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyCDqf1KgJPE8CkHzL3quKcILcRo6Xo_8XM`,
    {
      token: customToken,
      returnSecureToken: true,
    }
  );
  return response.data.idToken;
};

module.exports = {
  getAuthToken,
};
