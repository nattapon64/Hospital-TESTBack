const jwt = require("jsonwebtoken");
const connection = require("../configs/sql-server");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error("Unauthorsized");
    }
    if (!authorization.startsWith("Bearer")) {
      throw new Error("Unauthorsized");
    }
    const token = authorization.split(" ")[1];
    payload = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(token)

    connection.connect();
    connection.query(
      `SELECT * FROM userlogin WHERE CID = '${payload.CID}'`,
      async function (error, results, fields) {
        if (error) {
          connection.end();
          throw error;
        }
        // console.log(results[0]); // ตรวจสอบผลลัพธ์ที่ได้
        req.user = results[0]; // เก็บผลลัพธ์ไว้ใน req.user

        // console.log(req.user); // ตรวจสอบว่าผลลัพธ์ถูกเก็บไว้ใน req.user ถูกต้องหรือไม่
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};
