const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const uploadRoutes = require('./routes');

app.use(fileUpload());
router.post('/upload', Authenticate, adminController.uploadFile);

app.listen(8000, () => console.log('Server Started on port 8000'));
