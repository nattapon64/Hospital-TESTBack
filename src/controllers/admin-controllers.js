const { check } = require("prisma")
// const prisma = require("../configs/sql-server")
// const db = require("../models/db")
const bcrypt = require('bcryptjs')
const connection = require("../configs/sql-server")
const jwt = require('jsonwebtoken');
const util = require('util');

exports.roleUser = async (req, res, next) => {
    try {

        connection.connect();

        connection.query(`select * from typeuser`, function (error, results, fields) {
            if (error) {
                connection.end();
                throw error;
            }
            const role = results
            res.json({ role })
        })

    } catch (err) {
        next(err)
        console.log(err)
    }
}


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



exports.searchUser = async (req, res, next) => {
    const card = req.query.card || ''
    const username = req.query.username || null
    console.log(username)
    try {
        connection.connect()

        connection.query(`select u.CID, u.username, u.passrname1, u.password1, u.BAnumber, u.GetPay, t.typeuserName from userlogin as u inner join typeuser as t on u.typeuserID  = t.typeuserID where u.CID = '${card}' or u.username = '${username}'`, function (error, results, fields) {
            if (error) throw error
            const user = results[0]
            // console.log(results)
            res.json({ user })
        })
    } catch (err) {
        next(err)
    }
}



exports.reportuser = async (req, res, next) => {
    try {
        const { typeuser } = req.params;
        let skip = parseInt(req.query.skip) || 0;
        const pageSize = 10;
        skip = skip === -10 ? 0 : skip;
        const query = `
            SELECT CID, username, passrname1, password1, statedit
            FROM userlogin
            WHERE typeuserID = ?
            LIMIT ?, ?
        `;

        connection.query(query, [typeuser, skip, pageSize], (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json({ users: results });
        });
    } catch (error) {
        next(error);
    }
};


exports.reportsumuser = async (req, res, next) => {
    try {
        connection.connect();
        connection.query(`SELECT userlogin.typeuserID, typeuser.typeuserName, COUNT(userlogin.CID) AS CountOfCID
            FROM userlogin
            INNER JOIN typeuser ON userlogin.typeuserID = typeuser.typeuserID
            GROUP BY userlogin.typeuserID, typeuser.typeuserName
            ORDER BY userlogin.typeuserID ASC, typeuser.typeuserName ASC;`,
            function (error, results, fields) {
                if (error) throw error;
                res.json(results);
            }
        );
    } catch (err) {
        next(err);
    }
};

const mysql = require('mysql');

exports.getAddusersystem = async (req, res, next) => {
    try {
        connection.connect();
        connection.query(`SELECT * FROM office_sit`, function (error, results, fields) {
            if (error) {
                connection.end();
                throw (error);
            }
            const Addusersystem = results
            res.json({ Addusersystem })
        })
    } catch (err) {
        next(err)
        console.log(err)
    }
}

const query = util.promisify(connection.query).bind(connection);

exports.postAddusersystem = async (req, res, next) => {
    const { USID, CID, office_id, statedit } = req.body;
    const maxIDResult = await query(`SELECT MAX(USID) AS MaxID FROM usersystem`);
    const maxID = maxIDResult[0].MaxID || 0;
    console.log(maxID)
    const newUSID = maxID + 1;
    try {
        const query = `INSERT INTO usersystem (USID, CID, office_id, statedit) VALUES (?, ?, ?, ?)`;
        const values = [newUSID, CID, office_id, statedit];

        connection.query(query, values, (error, results) => {
            if (error) {
                return next(error);
            }
            res.status(201).json({ message: 'User added successfully', userId: results.insertId });
        });
    } catch (err) {
        next(err);
    }
};
