import bcrypt from 'bcrypt';

const userMethods = {
    comparePassword: async function(password){
        return bcrypt.compare(password, this.password);
    }
}

export default userMethods;