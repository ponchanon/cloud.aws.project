const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const writeData = require("../lib/writeData");
const {ORDERS} = require("../DB");

exports.createCart = async (req, res) => {
    const user = req.user;
    const {productId, productName, quantity, price} = req.body;
    try {
        const newCart = new Cart(null, user, productId, productName, quantity, price, price).save();
        res.status(200).json(newCart);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.getCart = async (req, res) => {
    res.status(200).json(Cart.getCarts(req.user));
}

exports.updateCart = (req, res) => {
    const {id} = req.params;
    const {quantity} = req.body;
    try {
        const carts = Cart.update(id, quantity);

        res.status(200).json(carts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.deleteCart = (req, res) => {
    const user = req.user;
    try {
        Cart.empty(user);
        res.status(200).json({});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.placeOrder = (req, res) => {
    const user = req.user;
    try {
        const carts = Cart.getCarts(user);
        const products = Product.getAll();

        carts.forEach((cart) => {
            const product = products.find(p => p.id == cart.productId);
            if (cart.quantity > product.stock) {
                return res.status(400).json({error: `item out of stock`});
            }
        });

        carts.forEach((cart) => {
            cart.userId = +cart.userId;
            cart.status = req.query.action;
            writeData(ORDERS, cart, () => {
                const tempProduct = products.find(p => p.id == cart.productId);
                const {id, name, price, stock, image} = tempProduct;
                const product = new Product(id, name, price, image, stock - cart.quantity);
                product.edit();
            });
        });

        Cart.empty(user);
        if (req.query.action == 'cancel') {
            return res.status(200).json({message: 'Order failed'});
        } else {
            return res.status(200).json({message: 'Order successfully placed'});
        }

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}