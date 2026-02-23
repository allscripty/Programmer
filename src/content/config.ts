import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { docsLoader } from '@astrojs/starlight/loaders';

export const collections = {
    docs: defineCollection({
        loader: docsLoader(),
        // Extend Starlight's default schema with your own custom fields
        schema: docsSchema({
            extend: z.object({
                difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Exam-Prep']).optional(),
                tags: z.array(z.string()).optional(),
                author: z.string().default('allscripty'),
            })
        })
    })
};
