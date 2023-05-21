import bcrypt from 'bcryptjs';

const userMethods = {
    comparePassword: async function(password){
        return bcrypt.compare(password, this.password);
    }
}

export default userMethods;