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
        const sortParam = sort ? `&sort=${sort}` : '';
        const queryParam = query ? `&query=${query}` : '';
      

       const links = {
             prevLink: productsData.hasPrevPage 
             ? `${baseUrl}?page=${productsData.prevPage}&limit=${limit}${sortParam}${queryParam}`: null,
             nextLink: productsData.hasNextPage 
             ? `${baseUrl}?page=${productsData.nextPage}&limit=${limit}${sortParam}${queryParam}` 
             : null
            }
            res.status(200).json({
            status: 'success',
            payload: productsData.payload, 
            totalPages: productsData.totalPages,
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
    if (updateData._id) delete updateData._id
    try {
        const updateProduct = await productDAO.updateProduct(pid, updateData);

        if (!updateProduct) {
        return res.status(404).json({ status: "error", message: `Producto con id ${pid} no encontrado.` });
    }
    res.status(200).json({ status: "success", message: `Producto con id ${pid} actualizado.`, payload: updateProduct });

 } catch (error) {
    console.error(`Error al actualizar producto ${pid}:`, error);
        res.status(500).json({status:"error", message: 'Error del servidor al actualizar el producto.' });
    }
})



router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const result = await productDAO.deleteProduct(pid);
        if (!result) {
            return res.status(404).json({ status: "error", message: `Producto con id ${pid} no encontrado.` });
        }
        res.status(200).json({ status: "success", message: `Producto con id ${pid} eliminado exitosamente.` });
    
    } catch (error) {
        console.error(`Error al eliminar producto ${pid}:`, error);
        res.status(500).json({ status: "error", message: 'Error del servidor al eliminar el producto' });
    }
    
});

export default router;

    


