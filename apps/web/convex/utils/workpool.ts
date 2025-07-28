import { Workpool } from '@convex-dev/workpool';
import { components } from '../_generated/api';

export const scrapeWorkpool = new Workpool(components.scrapeWorkpool, {
  maxParallelism: 1,
});

export const mediaWorkpool = new Workpool(components.mediaWorkpool, {
  maxParallelism: 1,
});

export const searchIndexWorkpool = new Workpool(
  components.searchIndexWorkpool,
  {
    maxParallelism: 1,
  },
);

export const karakeepWorkpool = new Workpool(components.karakeepWorkpool, {
  maxParallelism: 1,
});
