import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
    title: String,
    description: String
});

export const Note = model('Note', NoteSchema);
