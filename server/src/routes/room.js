const express = require('express');
const router = express.Router();
const roomCtrl = require('../controllers/room');

const { authenticateToken } = require('../middlewares/auth');

router.post('/create', authenticateToken, roomCtrl.create);
router.get('/:roomId', authenticateToken, roomCtrl.getMessages);
router.get('/:roomId/manage', roomCtrl.find);
router.post('/:roomId/members/add', authenticateToken, roomCtrl.addMembers);
router.get('/:roomId/invitation/accept', roomCtrl.acceptInvitation);
router.get('/:roomId/invitation/decline', roomCtrl.declineInvitation);
router.get('/:roomId/members', authenticateToken, roomCtrl.allMembers);
router.post('/:roomId/promote', authenticateToken, roomCtrl.promoteUserToOwner);
router.get('/:roomId/leave', authenticateToken, roomCtrl.removeMember);

module.exports = router;