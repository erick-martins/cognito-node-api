const EventEmitter = require("events");
const factory = require("error-factory");
const {
  UserPool
} = require("../../../../config/aws/aws-cognito");
const userRoles = require("../../../../config/userRoles");

const mediator = new EventEmitter();

const ValidationToken = factory("ValidationTokenError");
const emitValidationTokenError = err =>
  mediator.emit("get-user.ValidationTokenError", err);
const emitSuccess = result => mediator.emit("get-user.Success", result);
const emitError = err => mediator.emit("get-user.ErrorGettingUserData", err);

const IsTokenValid = (accessToken, type) => {
  const {
    TokenValidator
  } = UserPool(type);
  return new Promise((resolve, reject) => {
    TokenValidator.validate(accessToken, function (error, user) {
      if (error) {
        reject(ValidationToken())
      } else {
        resolve()
      }
    });
  })

};


const getUserAttributes = (user, AccessToken, type) => {
  const {
    IdentityProvider
  } = UserPool(type);

  IdentityProvider.getUserAttributes((err, result) => {
    if (err) {
      console.log(err.message || JSON.stringify(err));
      Promise.reject(emitError(err))
      return;
    }
    for (i = 0; i < result.length; i++) {
      console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
      user[result[i].getName()] = result[i].getValue();
    }
    Promise.resolve(emitSuccess(user))
    return user
  })



}


const getData = (AccessToken, type) => {
  const {
    IdentityProvider
  } = UserPool(type);

  return new Promise((resolve, reject) => {
    IdentityProvider.getUser({
      AccessToken
    }, (err, data) => {
      if (err) {
        reject(emitError(err))
      } else {
        let user = {
          username: data.Username,
          phone: {
            value: "",
            verified: false,
          },
          email: {
            value: "",
            verified: false,
          },
          permissions: userRoles[0].permissions
        }
        data.UserAttributes.map(attr => {
          if ("email_verified" == attr.Name) {
            user.email.verified = attr.Value == "true"
          } else if ("phone_number_verified" == attr.Name) {
            user.phone.verified = attr.Value == "true"
          } else if ("phone_number" == attr.Name) {
            user.phone.value = attr.Value
          } else if ("email" == attr.Name) {
            user.email.value = attr.Value
          } else {
            user[attr.Name] = attr.Value
          }
        })
        resolve(user)
      }

    });

  })

}

module.exports = ({
  accessToken,
  type
}) => {
  IsTokenValid(accessToken, type)
    .then(() => getData(accessToken, type))
    .then(user => getUserAttributes(user, accessToken, type))
    .catch(ValidationToken, emitValidationTokenError);

  return mediator;
};