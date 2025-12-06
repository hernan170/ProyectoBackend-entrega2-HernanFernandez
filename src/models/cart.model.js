import mongoose from 'mongoose'
import  mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                     default: 1
                   
                }
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function() {
    this.populate('products.product')
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

export const CartModel = mongoose.model(cartCollection, cartSchema)

