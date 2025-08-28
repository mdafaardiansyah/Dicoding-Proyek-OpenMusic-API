const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp').required(),
}).unknown();

// Schema untuk validasi ukuran file maksimal 500KB (512000 bytes)
const ImagePayloadSchema = Joi.object({
  size: Joi.number().max(512000).required().messages({
    'number.max': 'Ukuran file tidak boleh melebihi 500KB (512000 bytes)',
  }),
}).unknown();

module.exports = { ImageHeadersSchema, ImagePayloadSchema };