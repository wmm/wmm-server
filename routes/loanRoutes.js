const express = require('express');
const loanController = require('../controllers/loanController');

const router = express.Router();


router.get('/', loanController.getLoans);
router.post('/', loanController.create);


module.exports = router;