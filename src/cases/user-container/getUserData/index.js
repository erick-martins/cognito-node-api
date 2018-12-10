const getUserData = require("./useCase");
const requestHandler = require("./requestHandler");

module.exports = ({
    apiResponses
  }) =>
  requestHandler({
    getUserData,
    apiResponses
  });