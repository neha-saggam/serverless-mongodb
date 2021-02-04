'use strict';
import { config } from 'dotenv';
import { connectToDatabase } from './db';
import { Note } from './models/Note';

config({ path: './variables.env' });

export const create = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectToDatabase();
    try {
        const note = await Note.create(JSON.parse(event.body))
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(note)
        });
    } catch(err) {
        callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the note.'
        })
    }
};

export const getOne = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectToDatabase();
    try {
        const note = await Note.findById(event.pathParameters.id)
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(note)
        })
    } catch(err) {
        callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the note.'
        })
    }
};

export const getAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.find()
                .then(notes => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(notes)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the notes.'
                }))
        });
};

export const update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(note)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the notes.'
                }));
        });
};

export const deleteNote = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.findByIdAndRemove(event.pathParameters.id)
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Removed note with id: ' + note._id, note: note })
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the notes.'
                }));
        });
};
