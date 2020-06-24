const express = require('express');
const loanController = require('../controllers/loanController');

const router = express.Router();


router.get('/', loanController.getLoans);
router.post('/', loanController.create);

router.patch('/id/:loanId(\\d+)/confirm', loanController.confirm);


module.exports = router;