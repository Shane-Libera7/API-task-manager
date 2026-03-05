const { z } = require('zod');


const createTasksSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    due_date: z.coerce.date().optional(),
    completed: z.boolean().optional()
})

const patchTasksSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    due_date: z.coerce.date().optional(),
    completed: z.boolean().optional()
})

module.exports = { createTasksSchema, patchTasksSchema };