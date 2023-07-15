const express = require('express');
const { createCart, getCart, deleteCart, updateCart, placeOrder } = require('../controllers/cartController');
const router = express.Router();

//Routing mapping
router.post('/', createCart);
router.get('/', getCart);
router.post('/update/:id', updateCart);
router.post('/placeOrder', placeOrder);
router.delete('/delete', deleteCart);

module.exports = router;