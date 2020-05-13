const bcrypt = require("bcryptjs");

const encrypt = (plainString) => {
    return bcrypt.hashSync(plainString, bcrypt.genSaltSync(10));
}

const compare = (plainString, hashString) => {
    return bcrypt.compareSync(plainString, hashString)
}

module.exports = {
    encrypt,
    compare
}
