const jwt = require("jsonwebtoken");

const generateJWT = (id, role) => {
  const token = jwt.sign(
    { userId: id, role: role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30m" }
  );

  return token;
};

module.exports = { generateJWT };
