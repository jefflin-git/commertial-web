const db = require('../models')
const { Cart, CartItem, Product } = db

const cartController = {
  getCart: async (req, res) => {
    try {
      let totalPrice = 0
      const cart = await Cart.findByPk(req.session.cartId, {
        include: [{ model: Product, as: 'items' }],
      })
      if (!cart) return res.render('cart', { totalPrice })
      totalPrice = cart.items.length > 0 ? cart.items.map((d) => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart: cart.toJSON(),
        totalPrice
      })
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  postCart: async (req, res) => {
    try {
      const cart = await Cart.findOrCreate({ where: { id: req.session.cartId || 0 } })
      let cartItem = await CartItem.findOrCreate({
        where: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId,
        }
      })
      await cartItem[0].update({
        quantity: (cartItem[0].dataValues.quantity || 0) + 1
      })
      req.session.cartId = cart[0].dataValues.id
      req.session.save()
      res.redirect('back')
    } catch (error) {
      console.log(error)
      res.render('error', { message: 'error !' })
    }
  },
  addCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity + 1
    })
    res.redirect('back')
  },
  subCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1,
    })
    res.redirect('back')
  },
  deleteCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.destroy()
    res.redirect('back')
  }
}

module.exports = cartController