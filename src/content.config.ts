import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const timeSlotItemSchema = z.object({
  start: z.string(),
  end: z.string(),
  performers: z.array(z.string()),
});

const floorTimeSlotsSchema = z.object({
  floor: z.string(),
  slots: z.array(timeSlotItemSchema),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    slug: z.string().optional(), // ★ここに追加！任意のURLパスを指定可能にするにゃ
    category: z.enum(['performance', 'organized', 'technical']),

    genre: z.union([z.string(), z.array(z.string())]).optional(),
    role: z.string().optional(),

    time: z.object({
      start: z.string(),
      end: z.string().optional(),
    }).optional(),

    place: z.object({
      name: z.string(),
      url: z.string().url().optional(),
      isVr: z.boolean().optional(),
      instance: z.enum(['Public', 'Friends+', 'Friends', 'Invite+', 'Invite', 'Group', 'Group+']).optional(),
    }).optional(),

    organizers: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
    })).optional(),
    group: z.object({
      name: z.string(),
      url: z.string().url().optional(),
    }).optional(),

    performers: z.array(z.object({
      name: z.string(),
      role: z.string().optional(),
      url: z.string().url().optional(),
    })).optional(),

    announcements: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
    })).optional(),
    hashtags: z.array(z.string()).optional(),

    flyer: image().optional(),
    timetableImage: image().optional(),

    timeSlots: z.union([
      z.array(timeSlotItemSchema),
      z.array(floorTimeSlotsSchema),
    ]).optional(),

    mixArchives: z.array(z.object({
      platform: z.enum(['youtube', 'mixcloud', 'cloudflare']),
      url: z.string().url(),
      title: z.string().optional(),
    })).optional(),

    setlist: z.array(z.object({
      artist: z.string(),
      track: z.string(),
      url: z.string().url().optional(),
    })).optional(),

    gallery: z.array(z.string().url()).optional(),
  }),
});

export const collections = { events };