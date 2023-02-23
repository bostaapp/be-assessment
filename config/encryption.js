const bcryptjs = require("bcryptjs");

module.exports = class Encryption {
    static #salt = 12;
    static useBcryptjsHash(password){
        return bcryptjs.hash(password, this.#salt);
    }
    static useBcryptjsCompare(inputPassword, hashedPassword){
        return bcryptjs.compare(inputPassword, hashedPassword);
    }
}