const express = require('express')
const router = express.Router()
const {getHomePage, postCreateUser,getUpdatePage} = require('../controller/homeController')
// middleware that is specific to this router

router.get('/', getHomePage);
router.get('/update/:id', getUpdatePage);

router.post('/create-user',postCreateUser);
// router.get('/getAllUser',getAllUser);


module.exports = router

