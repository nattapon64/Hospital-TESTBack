const { check } = require("prisma")
const bcrypt = require('bcryptjs')
const connection = require("../configs/sql-server")
const jwt = require('jsonwebtoken');
const error = require("../middlewares/error");

const CryptoJS = require('crypto-js');

exports.getuser = async (req, res, next) => {
    const { CID } = req.query;

    if (!CID) {
        return res.status(400).json({ error: "CID parameter is required" });
    }

    try {
        const query = `
            SELECT userlogin.CID, userlogin.username, 
                   userlogin.passrname1, userlogin.password1, 
                   userlogin.BAnumber, userlogin.getpay, 
                   userlogin.typeuserID 
            FROM userlogin 
            WHERE userlogin.CID = ?
        `;

        connection.query(query, [CID], (error, results) => {
            if (error) {
                return next(error);
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({ user: results[0] });
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { userID } = req.params;
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

    if (password1 !== confirmPassword) {
        return res.status(400).json({ error: 'รหัสผ่านไม่ตรงกัน' });
    }

    try {
        // Encrypt password if provided
        const hashedPassword = password1 ? CryptoJS.AES.encrypt(password1, process.env.ENCODE).toString() : undefined;

        let sql = `UPDATE userlogin SET 
            username = ?, 
            passrname1 = ?, 
            ${password1 ? 'password1 = ?, ' : ''} 
            BAnumber = ?, 
            ${roleID ? 'typeuserID = ?, ' : ''} 
            GetPay = ?, 
            statedit = ?, 
            group30ID = ?, 
            GSgroup30ID = ?, 
            admin = ?, 
            superuser = ? 
            WHERE CID = ?`;

        let values = [
            username,
            passrname1,
            ...(password1 ? [hashedPassword] : []),
            BAnumber,
            ...(roleID ? [roleID] : []),
            GetPay,
            statedit,
            group30ID,
            GSgroup30ID,
            admin,
            superuser,
            CID
        ];

        // Remove placeholder for roleID if not provided
        if (!roleID) {
            sql = sql.replace('typeuserID = ?, ', '');
        }

        query(sql, values, (error, results) => {
            if (error) {
                console.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:', error);
                return res.status(500).json({ error: 'ข้อผิดพลาดในการอัปเดตผู้ใช้' });
            }
            console.log('อัปเดตผู้ใช้สำเร็จ');
            res.status(200).json({ message: 'อัปเดตผู้ใช้สำเร็จ' });
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดำเนินการคำขอ:', error);
        res.status(500).json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
};


exports.reportUserOT = async (req, res, next) => {
    try {
        const { CID } = req.params;

        connection.query(
            `SELECT monthOTU.CID, userlogin.username, typeuser.typeuserName
            FROM monthOTU
            INNER JOIN userlogin ON monthOTU.CID = userlogin.CID
            INNER JOIN typeuser ON userlogin.typeuserID = typeuser.typeuserID
            WHERE userlogin.BAnumber IS NOT NULL AND monthOTU.CID = ?
            GROUP BY monthOTU.CID, userlogin.username, typeuser.typeuserName`,
            [CID],
            function (error, results) {
                if (error) {
                    return next(error);
                }
                if (results.length === 0) {
                    return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
                }
                const user = results[0];
                if (user.token) {
                    const decodedToken = jwt.decode(user.token);
                    user.decodedToken = decodedToken;
                    // console.log(decodedToken);
                }
                console.log(user);
                return res.json({ user });
            }
        );
    } catch (error) {
        next(error);
    }
};
