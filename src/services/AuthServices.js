import AmazonCognito from 'amazon-cognito-identity-js'
import pooldata from '../config/cognito.js'
import { SaveUser } from './dbServices.js'
const userPool = new AmazonCognito.CognitoUserPool(pooldata);

// User sign-up function (cognito logic)
export const signup = async (UserName, Email, Password) => {
    const attributeList = [];
    const emailAttribute = {
        Name: 'email',
        Value: Email,
    };
    const usernameAttribute = {
        Name: 'preferred_username',
        Value: UserName || "",
    };

    // Create CognitoUserAttribute instances
    const attributeEmail = new AmazonCognito.CognitoUserAttribute(emailAttribute);
    const attributeUserName = new AmazonCognito.CognitoUserAttribute(usernameAttribute);

    attributeList.push(attributeEmail);
    attributeList.push(attributeUserName);

    // Call userPool.signUp() to initiate user sign-up process
    userPool.signUp(Email, Password, attributeList, null, function (err, result) {
        if (err) {
            console.error(err.message || JSON.stringify(err));
            return;
        }
        // const cognitoUser = result.user;
        // console.log('User name is ' );
    });
}

// Function to verify user's email using confirmation code
export const verifyEmail = async (Email, Code) => {
    var userData = {
        Username: Email,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognito.CognitoUser(userData);

    cognitoUser.confirmRegistration(Code, true, function (err, result) {
        if (err) {
            console.error(err.message || JSON.stringify(err));
            return;
        } else {
            SaveUser(Email)
            console.log('email verified');

        }
    });
}

// Function to resend confirmation code to user's email
export const resendCode = async (Email) => {

    var userData = {
        Username: Email,
        Pool: userPool,
    };

    const cognitoUser = new AmazonCognito.CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
            console.error(err.message || JSON.stringify(err));
            return;
        }
        console.log('code send Successfully');
    });
}

// User sign-in function
export const signin = async (Email, Password) => {
    return new Promise((resolve, reject) => {

        var userData = {
            Username: Email,
            Pool: userPool,
        };
        var cognitoUser = new AmazonCognito.CognitoUser(userData);

        var authenticationData = {
            Username: Email,
            Password: Password,
        };
        var authenticationDetails = new AmazonCognito.AuthenticationDetails(authenticationData);
        // Authenticate user using authentication details
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                var accessToken = result.getAccessToken().getJwtToken();
                resolve(accessToken); // Return the access token upon successful authentication
            },
            onFailure: function (err) {
                console.error(err.message || JSON.stringify(err));
                reject(err)
            },
        });
    });
}