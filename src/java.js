const bcrypt = require('bcryptjs')

const java = "$2a$08$S68DnOFfBa.tR4jli5r7v.8fpyJPZQE5bXcfFvx1zxq5ZowhbPg3."
const bcr =  bcrypt.decodeBase64(java)
console.log(bcr)