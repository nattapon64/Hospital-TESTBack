const { check } = require("prisma")
const bcrypt = require('bcryptjs')
const connection = require("../configs/sql-server")
const jwt = require('jsonwebtoken');
const error = require("../middlewares/error");

exports.updateUser = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    const java = "$2a$08$S68DnOFfBa.tR4jli5r7v.8fpyJPZQE5bXcfFvx1zxq5ZowhbPg3.";
    const decoded = atob(java);
    console.log(decoded);


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
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.decodeBase64;

        // SQL query for updating user data using parameterized queries
        const sql = `UPDATE userlogin SET 
            username = ?, 
            passrname1 = ?, 
            password1 = ?, 
            BAnumber = ?, 
            roleID = ?, 
            GetPay = ?, 
            statedit = ?, 
            group30ID = ?, 
            GSgroup30ID = ?, 
            admin = ?, 
            superuser = ? 
            WHERE CID = ?`;

        const values = [username, passrname1, hashedPassword, BAnumber, roleID, GetPay, statedit, group30ID, GSgroup30ID, admin, superuser, CID];

        query(sql, values, (error, results) => {
            if (error) {
                console.error('Error updating user:', error);
                return res.status(500).json({ error: 'Error updating user' });
            }
            console.log('User updated successfully');
            res.status(200).json({ message: 'User updated successfully' });
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
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
