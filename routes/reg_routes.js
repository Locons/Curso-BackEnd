const express = require('express');

let RegsController = require('../controllers/regs');
let router = express.Router();

router.get('/signup', RegsController.new);
router.route('/users').post(RegsController.create);

module.exports = router;