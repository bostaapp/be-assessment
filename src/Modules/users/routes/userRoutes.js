const validateRequest = require("../../../../common/middleware/validateRequest");
const { signUp, signIn, verifyUser} = require("../controllers/userController");
const { signUpSchema, signInSchema } = require("../validation/userValidation");


const route = require("express").Router();

route.post("/users/register", validateRequest(signUpSchema) , signUp)

route.get("/verify/:token", verifyUser)

route.post("/users/login", validateRequest(signInSchema), signIn)



module.exports = route