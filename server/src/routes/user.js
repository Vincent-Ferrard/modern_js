const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.patch('/confirm/:user', userCtrl.confirm)
router.post('/signin', userCtrl.signin);

router.get('/:username/rooms', userCtrl.allRooms);
router.post('/:username/status', userCtrl.allRooms);

module.exports = router;