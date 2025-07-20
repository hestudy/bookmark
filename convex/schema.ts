import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  links: defineTable({
    url: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    userId: v.id('users'),
    screenshot: v.optional(v.id('_storage')),
  }),
});

export default schema;
