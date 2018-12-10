const EventEmitter = require("events");
const factory = require("error-factory");
const {
  UserPool,
  Amazon
} = require("../../../../config/aws/aws-cognito");

const mediator = new EventEmitter();

const ValidationUsername = factory("ValidationUsernameError");
const ValidationPassword = factory("ValidationPasswordError");
const ValidationPhone = factory("ValidationPhoneError");

const attributeAws = (username, phone, name, role) => {
  let attributeList = [];

  let dataEmail = {
    Name: "email",
    Value: username
  };
  let dataPhoneNumber = {
    Name: "phone_number",
    Value: phone
  };
  let dataName = {
    Name: "name",
    Value: name
  };
  let dataRole = {
    Name: "custom:role",
    Value: role
  };
  var attributeEmail = new Amazon.CognitoUserAttribute(dataEmail);
  var attributePhoneNumber = new Amazon.CognitoUserAttribute(dataPhoneNumber);
  var attributeName = new Amazon.CognitoUserAttribute(dataName);
  var attributeRole = new Amazon.CognitoUserAttribute(dataRole)

  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);
  attributeList.push(attributeName);
  attributeList.push(attributeRole);

  return attributeList;
};

const checkUsername = value =>
  value ? Promise.resolve(value) : Promise.reject(ValidationUsername());

const checkPassword = value =>
  value ? Promise.resolve(value) : Promise.reject(ValidationPassword());

const checkPhone = value =>
  value ? Promise.resolve(value) : Promise.reject(ValidationPhone());

const emitValidationUsernameError = err =>
  mediator.emit("create-user.ValidationUsernameError", err);

const emitValidationPassordError = err =>
  mediator.emit("create-user.ValidationPasswordError", err);

const emitValidationPhoneError = err =>
  mediator.emit("create-user.ValidationPhoneError", err);

const emitSuccess = result => mediator.emit("create-user.Success", result);

const emitErrorCreateUserCognito = err =>
  mediator.emit("create-user.ErrorCreateUserCognito", err);

const signUp = (username, password, name, phone, type) => {
  const {
    Cognito
  } = UserPool(type);

  Cognito.signUp(
    username.replace("@", "_"),
    password,
    attributeAws(username, phone, name),
    null,
    (err, result) =>
    result ?
    Promise.resolve(emitSuccess(result)) :
    Promise.reject(emitErrorCreateUserCognito(err))
  );
};

module.exports = ({
  username,
  password,
  name,
  phone,
  role,
  type
}) => {
  checkUsername(username)
    .then(() => checkPassword(password))
    .then(() => checkPhone(phone))
    .then(() => signUp(username, password, name, phone, type, role))
    .catch(ValidationUsername, emitValidationUsernameError)
    .catch(ValidationPassword, emitValidationPassordError)
    .catch(ValidationPhone, emitValidationPhoneError);

  return mediator;
};