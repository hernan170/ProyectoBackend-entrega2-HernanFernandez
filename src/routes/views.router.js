import { Router } from 'express'
import ProductManager from '../ProductManager.js'
import CartManager from '../CartManager.js';

const router = Router();
const productManager = new ProductManager('src/data/products.json');
const cartManager = new CartManager('src/data/carts.json')

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.render('home', {
            title: "Lista de Productos Estática",
            products: products, 
        });
    } catch (error) {
        console.error("Error al obtener productos para la vista home:", error);
        res.status(500).send("Error interno del servidor al cargar la vista.");
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.render('realTimeProducts', {
            title: "Productos en Tiempo Real",
            products: products, 
        });
    } catch (error) {
        console.error("Error al obtener productos para la vista realTimeProducts:", error);
        res.status(500).send("Error interno del servidor al cargar la vista en tiempo real.");
    }
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).render('error', {
                title: "Error 404",
                message: `Carrito con ID ${cid} no encontrado.`,
            });
        }
        
        const productsWithDetails = await Promise.all(
            cart.products.map(async (item) => {
                const productDetail = await productManager.getProductById(item.product);
                return {
                    id: item.product,
                    quantity: item.quantity,
                    title: productDetail ? productDetail.title : 'Producto Desconocido',
                    price: productDetail ? productDetail.price : 0,
                };
            })
        );


        res.render('cart', {
            title: `Contenido del Carrito #${cid}`,
            cartId: cid,
            products: productsWithDetails,
            isEmpty: productsWithDetails.length === 0
        });

    } catch (error) {
        console.error(`Error al obtener el carrito ID ${cid}:`, error);
        res.status(500).send("Error interno del servidor al cargar la vista del carrito.");
    }
});

export default router;

