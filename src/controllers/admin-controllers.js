const { check } = require("prisma")
// const prisma = require("../configs/sql-server")
// const db = require("../models/db")
const bcrypt = require('bcryptjs')
const connection = require("../configs/sql-server")
const jwt = require('jsonwebtoken');
const util = require('util');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto-js')

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
        // console.log(err)
    }
}

exports.Tmouth = async (req, res, next) => {
    try {
        connection.connect();

        connection.query(`SELECT * FROM tmonth`, function (error, results, fields) {
            if (error) {
                connection.end();
                throw error;
            }
            const mouth = results
            res.json({ mouth })
        })
    } catch (err) {
        next(err)
    }
}


// exports.updateUser = async (req, res, next) => {
//     const token = req.headers['authorization'].split(' ')[1];

//     const java = "$2a$08$S68DnOFfBa.tR4jli5r7v.8fpyJPZQE5bXcfFvx1zxq5ZowhbPg3.";
//     const decoded = atob(java);
//     console.log(decoded);


//     const { userID } = req.params;
//     const {
//         CID,
//         username,
//         passrname1,
//         password1,
//         confirmPassword,
//         BAnumber,
//         GetPay,
//         roleID,
//         statedit,
//         group30ID,
//         GSgroup30ID,
//         admin,
//         superuser,
//     } = req.body;

//     if (password1 !== confirmPassword) {
//         return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     try {
//         // Hash password
//         const hashedPassword = await bcrypt.decodeBase64;

//         // SQL query for updating user data using parameterized queries
//         const sql = `UPDATE userlogin SET 
//             username = ?, 
//             passrname1 = ?, 
//             password1 = ?, 
//             BAnumber = ?, 
//             roleID = ?, 
//             GetPay = ?, 
//             statedit = ?, 
//             group30ID = ?, 
//             GSgroup30ID = ?, 
//             admin = ?, 
//             superuser = ? 
//             WHERE CID = ?`;

//         const values = [username, passrname1, hashedPassword, BAnumber, roleID, GetPay, statedit, group30ID, GSgroup30ID, admin, superuser, CID];

//         query(sql, values, (error, results) => {
//             if (error) {
//                 console.error('Error updating user:', error);
//                 return res.status(500).json({ error: 'Error updating user' });
//             }
//             console.log('User updated successfully');
//             res.status(200).json({ message: 'User updated successfully' });
//         });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


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
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = password1 ? crypto.AES.encrypt(password1, process.env.ENCODE).toString() : undefined;

        const sql = `UPDATE userlogin SET 
            username = ?, 
            passrname1 = ?, 
            ${password1 ? 'password1 = ?, ' : ''} 
            BAnumber = ?, 
            ${roleID ? 'roleID = ?, ' : ''} 
            GetPay = ?, 
            statedit = ?, 
            group30ID = ?, 
            GSgroup30ID = ?, 
            admin = ?, 
            superuser = ? 
            WHERE CID = ?`;

        const values = [
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




exports.searchUserID = async (req, res, next) => {
    const { CID } = req.query;
    if (!CID) {
        return res.status(400).json({ error: "IS NOT USER" });
    }

    try {
        connection.connect();

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
                return res.status(404).json({ error: "ไม่มีผู้ใช้นี้" });
            }

            res.status(200).json({ user: results });
        });
    } catch (err) {
        next(err);
    } finally {
        connection.end();
    }
};




exports.searchUser = async (req, res, next) => {
    const card = req.query.CID || ''
    const username = req.query.username || null
    console.log(username)
    try {
        connection.connect()

        connection.query(`select u.CID, u.username, u.passrname1, u.password1, u.BAnumber, u.GetPay, t.typeuserName from userlogin as u inner join typeuser as t on u.typeuserID  = t.typeuserID 
        where 
        u.CID = '${card}' or u.username = '${username}'`, function (error, results, fields) {
            if (error) throw error
            const user = results[0]
            // console.log(results)
            res.json({ user })
        })
    } catch (err) {
        next(err)
    }
}



connection.query = util.promisify(connection.query);

exports.reportuser = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 20 } = req.query; // Default values for page and limit

        const offset = (page - 1) * limit;

        // First query: Count the total number of records
        connection.query(
            'SELECT COUNT(*) AS total FROM userlogin WHERE typeuserID = ?',
            [type],
            function (countError, countResults) {
                if (countError) {
                    connection.end();
                    return next(countError);
                }

                const total = countResults[0].total;

                // Second query: Fetch the paginated records
                connection.query(
                    'SELECT CID, username, passrname1, password1, statedit FROM userlogin WHERE typeuserID = ? LIMIT ? OFFSET ?',
                    [type, parseInt(limit), parseInt(offset)],
                    function (dataError, dataResults) {
                        if (dataError) {
                            connection.end();
                            return next(dataError);
                        }

                        res.json({
                            data: dataResults,
                            total: total
                        });
                    }
                );
            }
        );
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
const uploadFileMiddleware = require("../middlewares/Upload");
// const connection = require("../configs/sql-server");
const { connect } = require("http2");

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
        // console.log(err)
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
        const query = `INSERT INTO usersystem (USID, CID, office_id, statedit) VALUES (?, ?, ?, 1)`;
        const values = [newUSID, CID, office_id, statedit];

        connection.query(query, values, (error, results) => {
            if (error) {
                return next(error);
            }
            res.status(200).json({ message: 'User added successfully', userId: results.insertId });
        });
    } catch (err) {
        next(err);
    }
};

exports.getReportsumuseBA_NULL = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const queryNULL = `
        SELECT userlogin.CID, userlogin.username, userlogin.BAnumber, userlogin.Getpay, userlogin.typeuserID, typeuser.typeuserName
        FROM userlogin
        INNER JOIN typeuser ON userlogin.typeuserID = typeuser.typeuserID
        WHERE userlogin.BAnumber IS NULL OR userlogin.BAnumber = ''
        ORDER BY userlogin.username
        LIMIT ? OFFSET ?
        `;

        connection.query(queryNULL, [limit, offset], function (error, results, fields) {
            if (error) {
                return next(error);
            }
            if (results.length > 0) {
                res.json({ results });
            } else {
                res.json({ message: "No records with NULL or empty BAnumber found" });
            }
        });
    } catch (err) {
        next(err);
    }
};


exports.getReportsumuseBA_NOTNULL = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const queryNOTNULL = `
        SELECT userlogin.CID, userlogin.username, userlogin.BAnumber, userlogin.Getpay, userlogin.typeuserID, typeuser.typeuserName
        FROM userlogin
        INNER JOIN typeuser ON userlogin.typeuserID = typeuser.typeuserID
        WHERE userlogin.BAnumber IS NOT NULL AND userlogin.BAnumber != ''
        ORDER BY userlogin.username
        LIMIT ? OFFSET ?
        `;

        connection.query(queryNOTNULL, [limit, offset], function (error, results, fields) {
            if (error) {
                return next(error);
            }
            if (results.length > 0) {
                res.json({ results });
            } else {
                res.json({ message: "No records with non-NULL BAnumber found" });
            }
        });

    } catch (err) {
        next(err);
    }
};


exports.getreportsumtypeOT = async (req, res, next) => {
    const { MTID, MYTD, MMTD } = req.body;
    try {
        connection.connect((err) => {
            if (err) {
                return next(err);
            }

            const query = `
                SELECT 
                    monthOTU.CID, 
                    userlogin.username, 
                    COUNT(monthOTU.ID) AS CountOfID, 
                    SUM(
                        monthOTU.amountP4P + 
                        monthOTU.sumot + 
                        monthOTU.amountP30 + 
                        monthOTU.amount010 + 
                        monthOTU.amount011 + 
                        monthOTU.amountBM + 
                        monthOTU.amount013 +  
                        monthOTU.amount014 +  
                        monthOTU.amount017
                    ) AS Expr1
                FROM 
                    monthOTU 
                INNER JOIN 
                    userlogin 
                ON 
                    monthOTU.CID = userlogin.CID
                WHERE 
                    monthOTU.typeot_ID = ? 
                    AND monthOTU.yearOT = ? 
                    AND monthOTU.monthOT = ?
                    AND userlogin.BAnumber IS NOT NULL
                GROUP BY 
                    monthOTU.CID, 
                    userlogin.username 
                ORDER BY 
                    userlogin.username;
            `;

            connection.query(query, [MTID, MYTD, MMTD], (error, results, fields) => {
                if (error) {
                    return next(error);
                }
                res.json(results);
                connection.end((err) => {
                    if (err) {
                        console.error('Error closing the connection:', err);
                    }
                });
            });
        });
    } catch (err) {
        next(err)
    }
};

exports.postAddtypeOT = async (req, res, next) => {
    const { typeot_ID, typeot_nameL, typeot_nameS } = req.body;
    try {
        const query = `INSERT INTO TypeOT (typeot_ID, typeot_nameL, typeot_nameS) VALUES (?, ?, ?)`;
        const values = [typeot_ID, typeot_nameL, typeot_nameS];

        connection.query(query, values, (error, results) => {
            if (error) {
                return next(error);
            }
            res.status(200).json({ message: 'addtypeOT success' });
        });
    } catch (err) {
        next(err);
    }
}

exports.getAddtypeOT = async (req, res, next) => {
    try {
        connection.connect();
        connection.query(`SELECT * FROM typeot;`, function (error, results, fields) {
            if (error) {
                connection.end();
                throw (error);
            }
            const AddtypeOT = results
            res.json({ AddtypeOT })
        })
    } catch (err) {
        next(err)
    }
}

exports.DeleteAddtypeOT = async (req, res, next) => {
    const { typeot_ID } = req.params;
    try {
        const query = 'DELETE FROM typeot WHERE typeot_ID = ?';
        const result = await connection.query(query, [typeot_ID]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Delete successful' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        next(err);
    }
};

const apiResponse = {
    validationErrorWithData: (res, message, data) => {
        return res.status(400).json({
            status: "error",
            message,
            data
        });
    },
    successResponseWithData: (res, message, data) => {
        return res.status(200).json({
            status: "success",
            message,
            data
        });
    },
    ErrorResponse: (res, err) => {
        return res.status(500).json({
            status: "error",
            message: err.message || "Internal Server Error",
        });
    }
};

exports.upload = [
    async (req, res) => {
        await uploadFileMiddleware(req, res);
        try {
            if (req.file == undefined) {
                return apiResponse.validationErrorWithData(
                    res,
                    "Upload a file please!",
                    {}
                );
            }
            return apiResponse.successResponseWithData(
                res,
                "File Uploaded Successfully",
                { path: req.file.path }
            );
        } catch (err) {
            console.error("Error saving file:", err);
            return apiResponse.ErrorResponse(res, err);
        }
    },
];

exports.reportsumOTU01 = async (req, res, next) => {
    try {
        const { monthOT, yearOT, username, page = 1 } = req.query;

        // Calculate the offset
        const limit = 50;
        const offset = (page - 1) * limit;

        // Construct the count query
        let countQuery = `
            SELECT 
                COUNT(DISTINCT monthotu.CID) AS totalRecords
            FROM 
                monthotu 
            INNER JOIN 
                userlogin ON monthotu.CID = userlogin.CID
            WHERE 
                monthotu.monthOT = ? AND
                monthotu.yearOT = ? ${username ? "AND userlogin.username LIKE ?" : ""}
        `;

        // Construct the data query with placeholders
        let dataQuery = `
            SELECT 
                monthotu.CID, 
                userlogin.username, 
                monthotu.office_id AS office_id, 
                SUM(monthotu.sumOT) AS SumOfsumOT, 
                SUM(monthotu.amountP4P) AS SumOfamountP4P, 
                SUM(monthotu.amountP30) AS SumOfamountP30, 
                SUM(monthotu.amountBM) AS SumOfamountBM, 
                SUM(monthotu.amount010) AS SumOfamount010, 
                SUM(monthotu.amount011) AS SumOfamount011, 
                SUM(monthotu.amount013) AS SumOfamount013, 
                SUM(monthotu.amount014) AS SumOfamount014, 
                SUM(monthotu.amountP4P + monthotu.sumOT + monthotu.amountP30 + monthotu.amountBM + monthotu.amount010 + monthotu.amount011 + monthotu.amount013 + monthotu.amount014) AS sumTotap4pl
            FROM 
                monthotu 
            INNER JOIN 
                userlogin ON monthotu.CID = userlogin.CID
            WHERE 
                monthotu.monthOT = ? AND
                monthotu.yearOT = ? ${username ? "AND userlogin.username LIKE ?" : ""}
            GROUP BY 
                monthotu.CID, 
                userlogin.username, 
                monthotu.office_id
            LIMIT ? OFFSET ?;
        `;

        const params = [monthOT, yearOT];
        if (username) {
            params.push(`%${username}%`);
        }

        // Execute the count query
        connection.query(countQuery, params.slice(0, 3), (countError, countResults) => {
            if (countError) {
                throw countError;
            }

            const totalRecords = countResults[0].totalRecords;

            // Execute the data query with parameters
            connection.query(dataQuery, [...params, limit, offset], (dataError, dataResults, fields) => {
                if (dataError) {
                    throw dataError;
                }

                const ReportSumOTU01 = dataResults;
                res.json({ totalRecords, ReportSumOTU01 });
            });
        });

    } catch (err) {
        next(err);
    }
};

exports.ReMoOTDetai02 = async (req, res, next) => {
    try {
        const { monthOTThai, yearOT, CID } = req.query;
        // console.log(req.query);

        function getMonthNumber(thaiMonth) {
            const months = [
                "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
                "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
                "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ];

            const index = months.indexOf(thaiMonth);
            if (index !== -1) {
                return (index + 1).toString().padStart(2, '0');
            } else {
                throw new Error("Invalid Thai month name ReMoOTDetai02User");
            }
        }

        // แปลงชื่อเดือนภาษาไทยเป็นตัวเลข (01-12)
        const month = getMonthNumber(monthOTThai);

        const sql = `
        SELECT 
        monthOTU.ID, 
        monthOTU.typeot_ID, 
        TypeOT.typeot_nameL, 
        monthOTU.office_id,  
        monthOTU.sumOT, 
        monthOTU.amountP4P, 
        monthOTU.amountP30, 
        monthOTU.amount013, 
        monthOTU.amount014,  
        (monthOTU.sumOT + monthOTU.amountP4P + monthOTU.amountP30 + monthOTU.amount013 + monthOTU.amount014) AS Expr1
    FROM 
        monthOTU 
    LEFT JOIN 
        TypeOT ON monthOTU.typeot_ID = TypeOT.typeot_ID
    WHERE 
        monthOTU.monthOT = ? AND
        monthOTU.yearOT = ? AND
        monthOTU.CID = ?
    GROUP BY 
        monthOTU.ID, 
        monthOTU.typeot_ID, 
        TypeOT.typeot_nameL, 
        monthOTU.office_id,  
        monthOTU.sumOT, 
        monthOTU.amountP4P, 
        monthOTU.amountP30, 
        monthOTU.amount013, 
        monthOTU.amount014;
    `;

        connection.query(sql, [month, yearOT, CID], (err, results) => {
            if (err) {
                return next(err);
            }
            // console.log(results)
            res.json({ results });
        });
    } catch (err) {
        next(err);
    }
};

exports.DeleteReMoOTDetai02 = async (req, res, next) => {
    const { ID } = req.params;
    try {
        const query = 'DELETE FROM monthOTU WHERE ID = ?';
        const result = await connection.query(query, [ID]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Delete successful' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        next(err);
    }
};

// exports.updateReMoOTDetai02 = async (req, res, next) => {
//     const { monthOTU } = req.params;
//     const {
//         typeot_ID,
//         amountOT,
//         office_id,
//         sumOT
//     } = req.body;

//     try {
//         const sql = `
//             UPDATE monthOTU 
//             SET typeot_ID = ?, 
//                 amountOT = ?, 
//                 office_id = ?, 
//                 sumOT = ?
//             WHERE id = ?;
//         `;

//         const values = [typeot_ID, amountOT, office_id, sumOT, monthOTU];

//         query(sql, values, (error, results) => {
//             if (error) {
//                 console.error('Error updating user:', error);
//                 return res.status(500).json({ error: 'Error updating user' });
//             }
//             console.log('User updated successfully');
//             res.status(200).json({ message: 'User updated successfully' });
//         });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.updateReMoOTDetai02 = async (req, res, next) => {
    const { monthOTU } = req.params;
    const {
        typeot_ID,
        amountOT,
        office_id,
        sumOT,
        amountP4P,
        amountP30,
        amount013,
        amount014
    } = req.body;

    const typeot_ID_safe = connection.escape(typeot_ID);
    const office_id_safe = connection.escape(parseInt(office_id));
    const amountOT_safe = connection.escape(parseFloat(amountOT));
    const sumOT_safe = connection.escape(parseFloat(sumOT));

    let sql;

    if (amountP4P) {
        const amountP4P_safe = connection.escape(parseFloat(amountP4P));
        sql = `
            UPDATE monthOTU 
            SET 
                typeot_ID = ${typeot_ID_safe},
                office_id = ${office_id_safe},
                amountP4P = ${amountOT_safe}
            WHERE 
                id = ${connection.escape(monthOTU)};
        `;
    } else if (amountP30) {
        const amountP30_safe = connection.escape(parseFloat(amountP30));
        sql = `
            UPDATE monthOTU 
            SET 
                typeot_ID = ${typeot_ID_safe},
                office_id = ${office_id_safe},
                amountP30 = ${amountOT_safe}
            WHERE 
                id = ${connection.escape(monthOTU)};
        `;
    } else if (amount013) {
        const amount013_safe = connection.escape(parseFloat(amount013));
        sql = `
            UPDATE monthOTU 
            SET 
                typeot_ID = ${typeot_ID_safe},
                office_id = ${office_id_safe},
                amount013 = ${amountOT_safe}
            WHERE 
                id = ${connection.escape(monthOTU)};
        `;
    } else if (amount014) {
        const amount014_safe = connection.escape(parseFloat(amount014));
        sql = `
            UPDATE monthOTU 
            SET 
                typeot_ID = ${typeot_ID_safe},
                office_id = ${office_id_safe},
                amount014 = ${amountOT_safe}
            WHERE 
                id = ${connection.escape(monthOTU)};
        `;
    } else {
        sql = `
            UPDATE monthOTU 
            SET 
                typeot_ID = ${typeot_ID_safe},
                amountOT = ${amountOT_safe},
                office_id = ${office_id_safe},
                sumOT = ${sumOT_safe}
            WHERE 
                id = ${connection.escape(monthOTU)};
        `;
    }

    try {
        await connection.query(sql);
        res.status(200).send('Update successful');
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
    }
};






