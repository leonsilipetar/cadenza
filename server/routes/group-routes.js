// Remove the entire contents of this file
const express = require('express');
const { createGroup, getGroupMessages } = require('../controllers/group-controller');

const router = express.Router();

router.post('/groups', createGroup);
router.get('/groups/:groupId/messages', getGroupMessages);

module.exports = router; 