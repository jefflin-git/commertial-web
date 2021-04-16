const productService = require('../../services/user/productService')

let productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, (data) => {
      switch (data['status']) {
        case 'success':
          req.flash('success_messages', data['message'])
          res.render('products', data)
          break
        case 'error':
          res.render('error', { message: 'error !' })
          break
        case 'fail':
          req.flash('error_messages', data['message'])
          res.redirect('back')
          break
      }
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      if (data['status'] === 'fail') {
        return res.render('error', { message: 'error !' })
      }
      return res.render('products', data)
    })
  }
}

module.exports = productController