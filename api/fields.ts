import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import connectToDatabase from './db.js';
import Field from './models/Field.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const { id, city, owner_id } = req.query;

        try {
            if (id) {
                const field = await Field.findById(id).lean();
                if (!field) return res.status(404).json({ error: 'Saha bulunamadı' });
                return res.status(200).json({ ...field, id: field._id.toString() });
            }

            let query: any = { status: 'approved' };
            if (city) query.city = city;
            if (owner_id) {
                query.owner_id = owner_id;
                delete query.status; // Owners can see their pending fields
            }

            const fields = await Field.find(query).lean();
            const mappedFields = fields.map((f: any) => ({
                ...f,
                id: f._id.toString()
            }));

            return res.status(200).json(mappedFields);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const fieldData = req.body;
            const newField = await Field.create(fieldData);
            return res.status(201).json(newField);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, ...updateData } = req.body;
            const updatedField = await Field.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedField) return res.status(404).json({ error: 'Saha bulunamadı' });
            return res.status(200).json(updatedField);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            await Field.findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
