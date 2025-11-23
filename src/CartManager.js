import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
    constructor(filePath) {
        this.path = path.join(__dirname, '..', filePath);
        this.lastId = 0;
        this.readyPromise = this.init();
    }

    async init() {
        try {
            const dirPath = path.dirname(this.path);
            await fs.mkdir(dirPath, { recursive: true });

            const carts = await this.readCartsFile(true);

            if (carts.length > 0) {
                this.lastId = carts.reduce((max, c) => {
                    const currentId = Number(c.id) || 0;
                    return (currentId > max ? currentId : max);
                }, 0);
            } else {
                this.lastId = 0;
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error("Error al inicializar CartManager:", error);
            this.lastId = 0;
        }
    }

    async readCartsFile(isInitCall = false) {
        if (!isInitCall) await this.readyPromise;

        try {
            const data = await fs.readFile(this.path, 'utf-8');
            if (!data || data.trim() === "") return [];
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
                return [];
            }
            console.error("[CartManager] Error al leer el archivo:", error);
            return [];
        }
    }

    async writeCartsFile(carts) {
        await this.readyPromise;
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('[CartManager] Error al escribir en el archivo:', error);
            throw new Error("No se pudo guardar la información del carrito.");
        }
    }

    async createCart() {
        const carts = await this.readCartsFile();

        this.lastId = Number(this.lastId) || 0;
        this.lastId++;

        const newCart = {
            id: this.lastId,
            products: [],
        };

        carts.push(newCart);
        await this.writeCartsFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readCartsFile();
        const cartId = parseInt(id);
        return carts.find(c => c.id === cartId) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readCartsFile();
        const cid = parseInt(cartId);
        const pid = parseInt(productId);

        const cartIndex = carts.findIndex(c => c.id === cid);

        if (cartIndex === -1) {
            throw new Error(`Carrito con ID ${cartId} no encontrado.`);
        }

        const cart = carts[cartIndex];
        const productInCartIndex = cart.products.findIndex(item => item.product === pid);

        if (productInCartIndex > -1) {
            cart.products[productInCartIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        carts[cartIndex] = cart;
        await this.writeCartsFile(carts);
        return cart;
    }
}

export default CartManager;