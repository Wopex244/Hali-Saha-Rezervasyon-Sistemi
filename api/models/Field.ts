import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String }, // URL to field image
    features: {
        type: [String],
        default: ['Açık Saha', 'Işıklandırma'] // e.g., 'Açık', 'Kapalı', 'Işıklı', 'Tribünlü', 'Otopark', 'Kantin'
    },
    pricing: {
        weekday: { type: Number, default: 1000 },
        weekend: { type: Number, default: 1200 },
        night_extra: { type: Number, default: 200 } // Extra for night slots
    },
    time_slots: {
        type: [String],
        default: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    created_at: { type: Date, default: Date.now }
});

const Field = mongoose.models.Field || mongoose.model('Field', FieldSchema);

export default Field;
