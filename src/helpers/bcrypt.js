import bcrypt from "bcrypt";

const salt = 10;

const encryptPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const comparePasswords = (inputPassword, hashedPassword) => {
    return bcrypt.compareSync(inputPassword, hashedPassword);
}

export default { encryptPassword, comparePasswords }