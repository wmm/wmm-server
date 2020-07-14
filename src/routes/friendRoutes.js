const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();


router.get('/', friendController.friends);
router.get('/requests', friendController.requests);
router.get('/add/:username', friendController.add);
router.get('/remove/:username', friendController.remove);


module.exports = router;