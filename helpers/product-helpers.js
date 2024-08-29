var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (product, callback) => {
        console.log(product);
        db.get().collection('product').insertOne(product).then((data) => {
            console.log(data);
            callback(data.insertedId)
        })

    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })

    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId)
            console.log(objectId(proId))
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDeatils: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    //admin making changes in the product
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        Name: proDetails.Name,
                        Category: proDetails.Category,
                        Price: proDetails.Price,
                        Description: proDetails.Description
                    }
                }).then((response) => {
                    resolve()
                })

        })
    },
    //
    updateCart: (productId, userId) => {
        return new Promise(async (resolve) => {
            const userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: objectId(userId)})
            if (!userCart) {
                const cart = {
                    user: objectId(userId),
                    products: [objectId(productId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cart, (err, done) => {
                    console.log(done)
                    resolve()
                })
            } else {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user: objectId(userId)}, {$push: {products: objectId(productId)}}, (err, done) => {
                        if (!err) {
                            resolve()
                        }
                    })
            }
        })
    }

}