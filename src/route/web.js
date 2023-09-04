const express = require('express')
const router = express.Router()
const {getHomePage, getHomeDemo} = require('../controller/homeController')
// middleware that is specific to this router

router.get('/', getHomePage);
router.get('/demo', getHomeDemo);
module.exports = router

