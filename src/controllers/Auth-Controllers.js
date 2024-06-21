const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../configs/sql-server");
const { json } = require("express");
const error = require("../middlewares/error");
const createError = require("../utils/createError");
const crypto = require('crypto-js')
const mysql = require('mysql2')
// const createError = require('http-errors');
require('dotenv').config()

exports.register = async (req, res, next) => {
  const {
    CID,
    username,
    passrname1,
    password1,
    confirmPassword,
    BAnumber,
    GetPay,
    roleID,
    statedit,
    group30ID,
    GSgroup30ID,
    admin,
    superuser,
  } = req.body;
  // console.log(req.body)
  try {
    if (!(username && password1 && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    if (confirmPassword !== password1) {
      throw next(new Error("Confirm Password not match"));
    }

    const hashedPassword = crypto.AES.encrypt(password1, process.env.ENCODE).toString()
    //  const showw = connection.connect()
    //  console.log(showw)
    const stated = statedit.toString();
    connection.connect();

    // connection.query(`select * from userlogin where CID = '${CID}'`, function(error, results, fields) {
    //   if(error) throw error;
    //   res.json(results)
    // })
    connection.query(
      `INSERT INTO userlogin(CID, username, passrname1, password1, BAnumber, typeuserID, GetPay,
        statedit, group30ID, GSgroup30ID, admin, superuser) values ('${CID}', '${username}', '${passrname1}', '${hashedPassword}', '${BAnumber}', '${roleID}' ,'${GetPay}', '${stated}', '${group30ID}', '${GSgroup30ID}', '${admin}', '${superuser}')`,
      function (error, results, fields) {
        if (error) throw error;
        // console.log("The solution is:", results);
        const show = results;
        // console.log(show)
        res.json({ message: 'Register Successfully' })
      }
    );
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};


// exports.login = async (req, res, next) => {
//   try {
//     const { passrname1, password1 } = req.body;

//     if (!passrname1 || !password1) {
//       return createError("ชื่อผู้ใช้หรือรหัสผ่านต้องไม่ว่างเปล่า");
//     }

//     if (typeof passrname1 !== "string" || typeof password1 !== "string") {
//       return createError(400, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
//     }

//     connection.connect();

//     const show = connection.query(
//       `SELECT * FROM userlogin WHERE passrname1 = '${passrname1}'`,
//       async function (error, results, fields) {
//         if (error) {
//           connection.end();
//           throw error;
//         } else
//         return results[0]
//       }
//     );
//     // console.log(show)
//     connection.end();
//     const checkpassword = crypto.AES.decrypt(show.password1, process.env.ENCODE);
//     const orgpassword = checkpassword.toString(crypto.enc.Utf8)
//     // console.log(orgpassword)
//     if (show.password1.startsWith("U")) {
//       if (orgpassword !== password1) {
//         res.json({ message: "fall" });
//       } else {
//         const token = await jwt.sign(
//           { CID: show.CID },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//           }
//         );
//         // console.log(token)
//         res.json({ token: token })
//       }
//     } else {
//       if (show.password1 !== password1) {
//         // console.log(orgpassword)
//         res.json({ message: "wow" })
//       } else {
//         const token = await jwt.sign(
//           { CID: show.CID },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//           }
//         );
//         res.json({ token: token })
//       }
//     }
//   } catch (err) {
//     next(err);
//     console.log(err);
//   }
// };

exports.login = async (req, res, next) => {
  try {
    const { passrname1, password1 } = req.body;

    if (!passrname1 || !password1) {
      return next(createError(400, "ชื่อผู้ใช้หรือรหัสผ่านต้องไม่ว่างเปล่า"));
    }

    if (typeof passrname1 !== "string" || typeof password1 !== "string") {
      return next(createError(400, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
    }
    connection.connect();

    connection.query(
      'SELECT * FROM userlogin WHERE passrname1 = ?',
      [passrname1],
      async (error, results) => {
        if (error) {
          return next(error);
        }

        if (results.length === 0) {
          return res.json({ message: "fall" });
        }

        const user = results[0];
        let orgpassword;

        if (user.password1.startsWith("U")) {
          const decrypted = crypto.AES.decrypt(user.password1, process.env.ENCODE);
          orgpassword = decrypted.toString(crypto.enc.Utf8);
        } else {
          orgpassword = user.password1;
        }

        if (orgpassword !== password1) {
          return res.json({ message: user.password1.startsWith("U") ? "fall" : "wow" });
        }

        const token = await jwt.sign(
          { CID: user.CID },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
      }
    );
  } catch (err) {
    next(err);
    console.error(err);
  }
};



exports.getme = (req, res, next) => {
  try {
    res.json(req.user);
    // console.log(req.user);
  } catch (error) {
    next(error);
  }
};
