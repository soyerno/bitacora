import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bitacora = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/bitacora' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
	}),
});

const boveda = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/boveda' }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { bitacora, boveda };
