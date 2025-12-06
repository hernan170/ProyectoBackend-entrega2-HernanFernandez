import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';


import ProductDAO from './ProductDAO.js'
import cartRouter from './routes/carts.router.js';
import productRouter from './routes/products.router.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const MONGO_URI = 'mongodb+srv://<usuario>:<password>@<cluster>/<nombre_db>?retryWrites=true&w=majority';
const productDAO = new ProductDAO(); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a la base de datos MongoDB')
    })
   
    app.get('/', async (req, res) => {
            try {
     
                const limit = parseInt(req.query.limit) || 10;
                const page = parseInt(req.query.page) || 1;

                const productsData = await productDAO.getProducts({ limit: limit, page: page });
                

                res.render('products', { 
                    products: productsData.payload, 
                    style: 'styles.css' 
                });
            } catch (error) {
                console.error('Error al obtener productos para la vista:', error);
                res.status(500).render('Error', { message: 'No se pudieron cargar los productos para la vista.'});
            }
        });

    app.use('/api/products', productRouter);
    app.use('/api/carts', cartRouter);


    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto: ${PORT}`);
         console.log(`URL: http://localhost:${PORT}`);
 })


