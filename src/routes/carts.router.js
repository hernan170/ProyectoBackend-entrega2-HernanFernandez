import { Router } from "express"
import CartDAO from "../CartDAO.js"



const router = Router()
const cartDAO = new CartDAO()

router.post('/', async (req, res) => {
    try {
        const newCart = await cartDAO.createCart()
        res.status(201).json({ status: 'success', message: 'Carrito creado con exito', cart: newCart})
    } catch (error) {
        console.error('Error al crear el carrito:', error)
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al crear el carrito.'})
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartDAO.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', message:`Carrito con ID ${cid} no encontrado.` })
     }
        res.status(200).json({ status: 'success', cart})
        
    } catch (error) {
        console.error(`Error al obtener carrito ${cid}:`, error)
        res.status(500).json({ status: "error", message: 'Error interno del servidor al obtener el carrito.' })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await CartDAO.addProductToCart(cid, pid)
        if (!updatedCart) {
            return res.status(404).json({ status: "error", message:'Carrito o Producto no encontrado. No se pudo agregar el item'})
        }
            res.status(200).json({ status: "success", message:`Producto ${pid} agregado en carrito ${cid}.`, cart: updatedCart})
    } catch (error) {
        console.error(`Error al agregar producto ${pid} al carrito ${cid}:`, error)
        res.status(500).json({ status: "error", message: 'Error del servidor al modificar el carrito.'})
   }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartDAO.removeProductFromCart(cid, pid)
        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: 'Carrito no encontrado o el producto no existe.' })
        }
        res.status(200).json({ status: "success", message: `Producto ${pid} eliminado del carrito ${cid}.`, cart: updatedCart})
    } catch {
        console.error(`Error al eliminar producto ${pid} del carrito ${cid}:`, error)
        res.status(500).json({ status: "error", message: 'Error del servidor al modificar el carrito.' })
    }
})

router.delete('/cid', async (req, res) => {
    const { cid } = req.params
    try {
        const clearedCart = await cartDAO.clearCart(cid)
        if (!clearedCart) {
            return res.status(404).json({ status: "error", message: `Carrito ${cid} no encontrado.`})
        }
        res.status(200).json({ status: "success", message: `Carrito ${cid} vaciado con exito.`, cart: clearedCart})
    } catch (error) {
        console.error(`Error al vaciar el carrito ${cid}:`, error)
        res.status(500).json({ status: "error", message: 'Error del servidor al vaciar el carrito.'})
    }
})

export default router;
    