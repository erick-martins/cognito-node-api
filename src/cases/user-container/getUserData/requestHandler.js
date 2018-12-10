module.exports = ({
  getUserData,
  apiResponses
}) => (req, res) => {
  getUserData({ ...req.body
    })
    .on("get-user.Success", apiResponses.ok(res))
    .on(
      "get-user.ErrorGettingUserData",
      apiResponses.badRequestWithMessage(res)
    )
    .on(
      "get-user.ValidationTokenError",
      apiResponses.badRequestWithMessage(res)
    )
    .on("get-user.Success", apiResponses.ok(res))
};