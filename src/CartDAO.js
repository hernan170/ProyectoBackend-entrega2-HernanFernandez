import { CartModel } from './models/cart.model.js'
import ProductModel from './models/product.model.js'


class CartDAO {
    async createCart() {
        try {
            const newCart = await CartModel.create({})
            return newCart.toObject()
        } catch (error) {
            console.error("Error al crear el carrito:", error)
            throw new Error("Error al crear el carrito") 
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).lean()
            return cart
        } catch (error) {
            console.error(`Error al obtener el carrito por ID (${cartId}):`, error)
            return null
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await CartModel.findById(cartId)
            if (!product) {
                console.warn(`Producto no encontrado cin ID: ${productId}`)
                return null
            }

            const cart = await CartModel.findById(cartId)
            if (!cart) {
                console.warn(`Carrito no encontrado con ID: ${cartId}`)
                return null
            }

            const existingItem = cart.products.find(item => item.product.toString() === productId)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                cart.products.push({ product: productId, quantity: 1})
            }
            await cart.save()
            const updatedCart = await this.getCartById(cartId)
            return updatedCart
        } catch (error) {
            console.error(`Error al agregar producto ${productId} al carrito ${cartId}:`, error)
            throw new Error('Error al modificar el carrito.')
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId)
            if (!cart) 
            return null
            const initialLength = cart.products.length
            cart.products = cart.proiducts.filter(item => item.product.toString() !== productId)
            if (cart.products.length === initialLength) {
            return null
            }
            await cart.save()
            return this.getCartById(cartId)
        } catch (error) {
            console.error(`Error al eliminar producto ${productId} del carrito ${cartId}:`, error)
            throw new Error('Error al eliminar producto del carrito.')
        }


    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                {$set: { products: [] }},
                { new: true }
            )

            if (result) {
                return this.getCartById(cartId)
            }
            return null
        } catch (error) {
            console.error(`Error al vaciar el carrito ${cartId}:`, error)
            throw new Error('Error al vaciar el carrito.')
        }
    }
}

export default CartDAO;