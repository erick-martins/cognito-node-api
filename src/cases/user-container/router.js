const createUser = require("./create");
const confirmUser = require("./confirm");
const resendUser = require("./resend-code");
const signIn = require("./signin");
const signOut = require("./signout");
const forgotPassword = require("./forgot-password");
const forgotPasswordConfirm = require("./forgot-password-confirm");
const validateToken = require("./validate");
const refreshToken = require("./refresh-token");
const getUserData = require("./getUserData");


const GatewayAuthKey =
  "UIFE8uhfeoua9haobUHAf8ohae043rokjmsdfslip2eqecsgr043irejmfcdn";

const {
  Router
} = require("express");

const userRoles = require("../../../config/userRoles");

module.exports = ({
  apiResponses
}) => {
  const router = Router();

  router.post(
    "/create",
    createUser({
      apiResponses
    })
  );
  router.post(
    "/confirm",
    confirmUser({
      apiResponses
    })
  );
  router.post(
    "/resend",
    resendUser({
      apiResponses
    })
  );
  router.post(
    "/signIn",
    signIn({
      apiResponses
    })
  );
  router.post(
    "/signOut",
    signOut({
      apiResponses
    })
  );
  router.post(
    "/forgot-password",
    forgotPassword({
      apiResponses
    })
  );
  router.post(
    "/forgot-password-confirm",
    forgotPasswordConfirm({
      apiResponses
    })
  );
  router.post(
    "/validate",
    validateToken({
      apiResponses
    })
  );
  //refreshSession
  router.post(
    "/refresh-token",
    refreshToken({
      apiResponses
    })
  );

  router.get("/all-roles", (req, res, next) => {
    // if (GatewayAuthKey != req.header.gatewayauthkey) {
    //   res.status(403).json({
    //     error: "access_denied",
    //     message: "You should be logged in"
    //   });
    // } else {
    res.json({
      success: true,
      roles: userRoles
    });
    //}
  });
  router.get("/", getUserData({
    apiResponses
  }));
  // router.get("/", (req, res, next) => {
  //   res.json({
  //     success: true,
  //     user: {
  //       name: "Erick",
  //       email: "ericknmp@gmail.com",
  //       phone: "(19) 99375-9538",
  //       role: "super_admin",
  //       permissions: userRoles[0].permissions,
  //       access: userRoles[0].access
  //     }
  //   });
  // });


  router.get("api/private", (req, res) => {
    res.json({
      message: "Esta authenticado"
    });
  });

  return router;
};