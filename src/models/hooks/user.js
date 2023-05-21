import bcrypt from 'bcryptjs';

const userHooks = {
    hashPassword: async function (next) {
            const user = this;
          
            if (!user.isModified('password')) {
              return next();
            }
          
            try {
              let SALT_WORK_FACTOR = 10;

              const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
              const hashedPassword = await bcrypt.hash(user.password, salt);
          
              user.password = hashedPassword;
              return next();
            } catch (err) {
              return next(err);
            }
        }
}

export default userHooks;