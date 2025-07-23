import { Meilisearch } from 'meilisearch';

export const meiliClient = new Meilisearch({
  host: process.env.MEILI_URL || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_KEY || 'masterKey',
});
