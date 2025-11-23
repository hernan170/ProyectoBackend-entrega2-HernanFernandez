import { Router } from "express"
import CartManager from "../CartManager.js"
import ProductManager from "../ProductManager.js"

const router = Router()
const cartManager = new CartManager('src/data/carts.json')
const productManager = new ProductManager('src/data/products.json')

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json({ status: 'success', payload: newCart})
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message})
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid)
        if (cart) {
            res.json({ status: 'success', payload: cart.products})
        } else {
            res.status(404).json({ status: "error", message: `Carrito con ID ${cid} no encontrado`})
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await productManager.getProductById(pid)
        if (!product) {
            return res.status(404).json({ status: "error", message:`Producto con ID ${pid} no existe.`})
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid)
        res.json({ status: "success", payload: updatedCart})
    } catch (error) {
        if (error.message.includes('Carrito')) {
            res.status(404).json({ status: "error", message: error.message})
        } else {
            res.status(500).json({ status: "error", message: error.message})
        }
    }
})

export default router;
    