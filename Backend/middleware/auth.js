const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET || "secret123"
    );

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      message: "invalid token"
    });
  }
}

module.exports = verifyToken;