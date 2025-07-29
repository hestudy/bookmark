import { Workpool } from '@convex-dev/workpool';
import { components } from '../_generated/api';

export const scrapeWorkpool = new Workpool(components.scrapeWorkpool, {
  maxParallelism: 10,
});

export const mediaWorkpool = new Workpool(components.mediaWorkpool, {
  maxParallelism: 10,
});

export const searchIndexWorkpool = new Workpool(
  components.searchIndexWorkpool,
  {
    maxParallelism: 10,
  },
);

export const karakeepWorkpool = new Workpool(components.karakeepWorkpool, {
  maxParallelism: 10,
});
