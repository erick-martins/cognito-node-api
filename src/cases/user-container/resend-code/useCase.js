const EventEmitter = require("events");
const factory = require("error-factory");
const { UserPool } = require("../../../../config/aws/aws-cognito");

const mediator = new EventEmitter();

const _ValidationUsername = factory("ValidationUsernameError");

const ValidationUsername = value =>
  value ? Promise.resolve(value) : Promise.reject(_ValidationUsername());

const emitValidationUsername = err =>
  mediator.emit("resend-user.ValidationUsername", err);

const emitSuccess = result => mediator.emit("resend-user.Success", result);
const emitError = err => mediator.emit("resend-user.Error", err);

const ResendCode = (username, type) => {
  const { CognitoUser } = UserPool(type);
  const Cognito = CognitoUser(username.replace("@", "_"));

  Cognito.resendConfirmationCode((err, result) =>
    result
      ? Promise.resolve(emitSuccess({ message: result }))
      : Promise.reject(emitError(err))
  );
};

module.exports = ({ username, type }) => {
  ValidationUsername(username)
    .then(() => ResendCode(username, type))
    .catch(_ValidationUsername, emitValidationUsername);

  return mediator;
};
