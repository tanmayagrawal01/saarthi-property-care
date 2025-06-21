import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        default: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Service', ServiceSchema);