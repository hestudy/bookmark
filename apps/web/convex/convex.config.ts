// convex/convex.config.ts
import workpool from '@convex-dev/workpool/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(workpool, { name: 'scrapeWorkpool' });
app.use(workpool, { name: 'mediaWorkpool' });
export default app;
