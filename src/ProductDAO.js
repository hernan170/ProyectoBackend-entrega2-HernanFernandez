import {ProductModel} from './models/product.model.js'

class ProductDAO {
   
    async getProducts(options = {}) { 
    
        const { limit = 10, page = 1, sort = null, query = {} } = options;
        try {
            const paginateOptions = {
                limit: limit,
                page: page,
                lean: true
            }
            if (sort) {
                paginateOptions.sort = { price: sort === 'asc' ? 1 : -1}
            }
            const products = await  ProductModel.paginate(query, paginateOptions)
            return{
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage
            }
        } catch (error) {
            console.error("Error al obtener productos:", error)
            return { status: 'error', error: 'No se puedieron obtener los productos de la base de datos'}
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id).lean()
            return product;
        } catch (error) {
            console.error(`Error al obtener producto por Id (${id}):`, error)
            return null
        }
    }
    
    async addProduct(productData) {
        try {
            const newProduct = await ProductModel.create(productData)
            return newProduct.toObject()
        } catch (error) {
            console.error("Error al agregar producto:", error)
            throw new Error('Erro de validación al crear el producto.')
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
            return updateProduct
        } catch (error) {
            console.error(`Error al actualizar producto (${id}):`, error)
            return null
        }
    }
    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id)
            return !!deleteProduct
        } catch (error) {
            console.error(`Error al eliminar producto (${id}):`, error)
            return false
        }
    }
}
    
export default ProductDAO;

 


