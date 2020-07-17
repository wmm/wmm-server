const express = require('express');
const loanController = require('../controllers/loanController');

const router = express.Router();


router.get('/', loanController.getLoans);
router.post('/', loanController.create);

router.get('/id/:loanId(\\d+)', loanController.get);
router.patch('/id/:loanId(\\d+)/confirm', loanController.confirm);
router.patch('/id/:loanId(\\d+)/reject', loanController.reject);


module.exports = router;