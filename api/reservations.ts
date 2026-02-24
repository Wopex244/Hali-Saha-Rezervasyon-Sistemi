import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import connectToDatabase from './db.js';
import Field from './models/Field.js';

// Define Reservation Schema (formerly Appointment)
const ReservationSchema = new mongoose.Schema({
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    user_id: { type: String, required: false },
    ad: { type: String, required: true },
    soyad: { type: String, required: true },
    telefon: { type: String, required: true },
    tarih: { type: String, required: true }, // Format: YYYY-MM-DD
    saat: { type: String, required: true },
    fiyat: { type: Number, required: true },
    durum: {
        type: String,
        enum: ['beklemede', 'onaylandi', 'iptal', 'tamamlandi'],
        default: 'beklemede'
    },
    created_at: { type: Date, default: Date.now }
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const { date, field_id, user_id, all } = req.query;

        try {
            let query: any = {};

            if (all === 'true') {
                // Admin or Owner view handled in frontend by filtering field_id or user_id
            } else if (date && field_id) {
                query.tarih = date;
                query.field_id = field_id;
                query.durum = { $ne: 'iptal' };
            } else if (user_id) {
                query.user_id = user_id;
            } else if (field_id) {
                query.field_id = field_id;
            }

            const reservations = await Reservation.find(query)
                .sort({ tarih: 1, saat: 1 })
                .lean();

            const mappedReservations = reservations.map((res: any) => ({
                ...res,
                id: res._id.toString()
            }));

            return res.status(200).json(mappedReservations);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { field_id, user_id, ad, soyad, telefon, tarih, saat, fiyat } = req.body;

            // Check if slot is already taken for THIS field
            const existing = await Reservation.findOne({
                field_id,
                tarih,
                saat,
                durum: { $in: ['beklemede', 'onaylandi'] }
            });

            if (existing) {
                return res.status(409).json({ error: 'Bu saat dilimi dolu.' });
            }

            const newReservation = await Reservation.create({
                field_id,
                user_id,
                ad,
                soyad,
                telefon,
                tarih,
                saat,
                fiyat
            });

            return res.status(201).json(newReservation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, durum } = req.body;

            if (!id || !durum) {
                return res.status(400).json({ error: 'Missing id or durum' });
            }

            const updatedReservation = await Reservation.findByIdAndUpdate(
                id,
                { durum },
                { new: true, lean: true }
            );

            if (!updatedReservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }

            return res.status(200).json(updatedReservation);
        } catch (error) {
            console.error('Error updating reservation:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
