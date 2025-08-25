/**
 * Joi validation schemas untuk Albums API
 * Mendefinisikan aturan validasi untuk request body albums
 */

const Joi = require('@hapi/joi');

/**
 * Schema validasi untuk POST /albums (create album)
 * Validasi data album baru yang akan dibuat
 */
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name album harus diisi',
    'string.empty': 'Name album tidak boleh kosong',
    'string.base': 'Name album harus berupa string',
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'any.required': 'Year album harus diisi',
    'number.base': 'Year album harus berupa angka',
    'number.integer': 'Year album harus berupa bilangan bulat',
    'number.min': 'Year album tidak boleh kurang dari 1900',
    'number.max': `Year album tidak boleh lebih dari ${new Date().getFullYear()}`,
  }),
});

module.exports = { AlbumPayloadSchema };