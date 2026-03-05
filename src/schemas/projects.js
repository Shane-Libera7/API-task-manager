const { z } = require('zod');

const createProjectSchema = z.object({
    name: z.string().min(1)
})

const patchProjectSchema = z.object({
    name: z.string().min(1).optional()
})

module.exports = { createProjectSchema, patchProjectSchema };