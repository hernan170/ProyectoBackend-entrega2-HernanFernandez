import { Router } from 'express';
import ProductDAO from '../ProductDAO.js';




const router = Router();
const productDAO = new ProductDAO();



router.get('/', async (req, res) => {
    const { limit = 10, page =1, sort, query } = req.query
    try {
        const options = { limit: parseInt(limit), page: parseInt(page), sort: sort, query: query }
        const productsData = await productDAO.getProducts(options) 
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const links = {prevLink: productsData.hasPrevPage ? `${baseUrl}?page=${productsData.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}`: null,
                       nextLink: productsData.hasNextPage ? `${baseUrl}?page=${productsData.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}`: null}
        res.status(200).json({
            status: 'success',
            payload: productsData.docs, 
            totalPages: producstDataroductsData.totalPages,
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            page: productsData.page,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            ...links
        })
    } catch (error) {
        console.error('Error al obtener productos:', error)
        res.status(500).json({ status: "error", message: 'Error del servidor al obtener productos.' })
    
    } 
})


router.get('/:pid', async (req, res) => {
    const { pid } = req.params
      try {
        const product = await productDAO.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: `Producto con id ${pid} no encontrado` });
        } 
            res.status(200).json({ status: "success", payload: product });
        
    } catch (error) {
        console.error( `Error al obtener producto ${pid}:` , error)
        res.status(500).json({ status: "error", message: 'Error del servidor al obtener el producto.' });
    } 
});


router.post('/', async (req, res) => {
    
    const productData = req.body
    if (!productData.title || !productData.price || !productData.code) {
        return res.status(400).json({ status: "error", message: "Faltan campos obligatorios: title, price, code." });
    }
    try {
        const newProduct = await productDAO.addProduct(productData)
        if(!newProduct) {
            return res.status(400).json({ status: "error", message: "El producto con ese codigo ya existente." });
        }
        res.status(201).json({ status: "success", message: 'Producto agregado exitosamente.', payload: newProduct});
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ status: "error", message: 'Error del servidor al agregar el producto' });

    }

});


router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const updateData = req.body
    if (!updateProduct) {
        return res.status(404).json({ status: "error", message: `Producto con id ${pid} no encontrado.` });
    }
    res.status(200).json({ status: "success", message: `Producto con id ${pid} actualizado.`, payload: updateProduct });
 }catch (error) {
        res.status(400).json({status:"error", message: error.message });
    }
}); 


router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
        return res.status(400).json({ status: "error", message: "ID de producto inválido." });
    }
    try {
        const wasDeleted = await productManager.deleteProduct(pid);
        if (wasDeleted) {
            res.json({ status: "success", message: `Producto con id ${pid} eliminado.`});

        } else {
            res.status(404).json({status: "error", message: `Producto con id ${pid} no encontrado.`});
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
    
});

export default router;

    


