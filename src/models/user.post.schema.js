const { required } = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    image: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} needs at least one image']
    },
    crop: {
        type: String,
        required: true,
        enum: ['Wheat', 'Rice', 'Corn', 'Barley', 'Soybean']
    },
    description: {
        type: String,
        required: true
    },
    selltill: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'selltill must be a future date'
        }
    },
    base_price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: " value must be greater then 0 "
        }
    },
    is_sold: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true });

function arrayLimit(val) {
    return val.length > 0;
}
postSchema.virtual('best_price').get(function () {
    return this.base_price;
});
// Virtual to check if the post is still valid
postSchema.virtual('isActive').get(function () {
    return this.selltill > new Date();
});
postSchema.virtual('RupeePerKg').get(function () {
    return this.base_price / this.quantity;
})
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('Post', postSchema);