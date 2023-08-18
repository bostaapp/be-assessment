import dotenv from 'dotenv';
dotenv.config();

const pooldata = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID,
};

export default pooldata;

