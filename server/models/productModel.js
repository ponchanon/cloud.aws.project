const fs = require("fs");
const path = require("path");
const fetchUser = require("../lib/fetchData");

let db = [];
// Read the contents of the text file
fetchUser('sc-products', (data) => {
    db = data;
});


//Product Class
module.exports = class Product {
    constructor(id, name, price, image, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.stock = stock;
    }

    //Adding to product list
    save() {
        db.push(this);
        return this;
    }

    //Updating Product
    edit() {
        const index = db.findIndex((prod) => prod.id == this.id);
        db.splice(index, 1, this);
        return this;
    }

    //Fetching all products from the db
    static getAll() {
        return db;
    }

    //Deleting existing product by product id
    static deleteById(prodId) {
        const index = db.findIndex((prod) => prod.id == prodId);
        const deletedProd = db[index];
        db.splice(index, 1);
        return deletedProd;
    }

    //Checking if product id exists
    static find(id) {
        return db.find((product) => product.id == id);
    }
};
