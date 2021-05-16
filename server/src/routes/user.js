const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const { authenticateToken } = require('../middlewares/auth');

router.post('/signup', userCtrl.signup);
router.patch('/confirm/:user', userCtrl.confirm)
router.post('/signin', userCtrl.signin);

router.get('/:username/rooms', authenticateToken, userCtrl.allRooms);
//router.get('/:username/status', authenticateToken, userCtrl.allOldRooms)
router.post('/:username/status', userCtrl.allRooms);

router.get('/data', authenticateToken, userCtrl.data);

module.exports = router;