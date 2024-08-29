var express = require('express');
const { render } = require('../app');

var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-products', { admin: true, products })

  })

});
router.get('/add-products', function (req, res) {
  res.render('admin/add-products')
})
router.post('/add-products', (req, res) => {
  productHelpers.addProduct(req.body, (insertedId) => {
    let images = req.files.Image
    const imageName = insertedId
    console.log(insertedId);
    images.mv('./public/product-images/' + imageName + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-products")
      } else {
        console.log(err);
      }
    })
  })
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })

})
router.get('/edit-products/:id', async (req, res) => {
  let product = await productHelpers.getProductDeatils(req.params.id)
  res.render('admin/edit-products', { product })
})
router.post('edit-products/:id', (req, res) => {
  console.log(req.params.id)
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
  res.redirect('/admin')
  })
})


module.exports = router;
