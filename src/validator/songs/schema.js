/**
 * Joi validation schemas untuk Songs API
 * Mendefinisikan aturan validasi untuk request body songs
 */

const Joi = require('@hapi/joi');

/**
 * Schema validasi untuk POST /songs (create song)
 * Validasi data lagu baru yang akan dibuat
 */
const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title lagu harus diisi',
    'string.empty': 'Title lagu tidak boleh kosong',
    'string.base': 'Title lagu harus berupa string',
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'any.required': 'Year lagu harus diisi',
    'number.base': 'Year lagu harus berupa angka',
    'number.integer': 'Year lagu harus berupa bilangan bulat',
    'number.min': 'Year lagu tidak boleh kurang dari 1900',
    'number.max': `Year lagu tidak boleh lebih dari ${new Date().getFullYear()}`,
  }),
  genre: Joi.string().required().messages({
    'any.required': 'Genre lagu harus diisi',
    'string.empty': 'Genre lagu tidak boleh kosong',
    'string.base': 'Genre lagu harus berupa string',
  }),
  performer: Joi.string().required().messages({
    'any.required': 'Performer lagu harus diisi',
    'string.empty': 'Performer lagu tidak boleh kosong',
    'string.base': 'Performer lagu harus berupa string',
  }),
  duration: Joi.number().integer().positive().optional().messages({
    'number.base': 'Duration lagu harus berupa angka',
    'number.integer': 'Duration lagu harus berupa bilangan bulat',
    'number.positive': 'Duration lagu harus berupa angka positif',
  }),
  albumId: Joi.string().optional().messages({
    'string.base': 'Album ID harus berupa string',
  }),
});

module.exports = { SongPayloadSchema };