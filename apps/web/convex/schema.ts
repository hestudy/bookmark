import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  tags: defineTable({
    name: v.string(),
    userId: v.id('users'),
  }),
  links: defineTable({
    url: v.string(),
    domain: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    textContent: v.optional(v.string()),
    html: v.optional(v.string()),
    image: v.optional(v.id('_storage')),
    favicon: v.optional(v.id('_storage')),
    userId: v.id('users'),
    poolId: v.optional(v.string()),
    tagIds: v.optional(v.array(v.id('tags'))),
  }),
});

export default schema;
