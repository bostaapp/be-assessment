import AuthService from "../services/auth";
import httpStatus from "http-status";

const AuthController = {
    async signupUser(req, res, next){
        const { email, password } = req.body;

        try{
            const response = await AuthService.signupUser({email, password})
            res.status(httpStatus.CREATED).json(response);
        }
        catch(err){
            return next(err)
        }
    },

    async signinUser(req, res, next){
        const { email, password } = req.body;

        try{
            const response = await AuthService.signinUser({email, password})
            res.status(httpStatus.OK).json(response);
        }
        catch(err){
            return next(err)
        }
    },

    async verifyUserEmail(req, res, next){
        const { token } = req.query;

        try{
            await AuthService.verifyUserEmail({token});
            res.status(httpStatus.NO_CONTENT).end();
        }
        catch(err){
            return next(err);
        }
    }
}

export default AuthController;