import AddLinkFormPopover from '@/components/link-form/add-link-form/add-link-form-popover';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ImageCard from '@/components/ui/image-card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from 'convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { formatDistance } from 'date-fns';
import { Plus } from 'lucide-react';
import { memo } from 'react';

const Home = memo(() => {
  const query = usePaginatedQuery(
    api.link.getLinkPage,
    {},
    {
      initialNumItems: 20,
    },
  );

  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <div>
          <Input readOnly placeholder="To Search..." />
        </div>
        <div>
          <AddLinkFormPopover>
            <Button size={'sm'}>
              <Plus /> add
            </Button>
          </AddLinkFormPopover>
        </div>
      </div>
      <ScrollArea className="flex-1 h-0">
        <div className="grid grid-cols-3 gap-4">
          {query.results.map((item) => {
            return (
              <Card key={item._id} className="pt-0 gap-4">
                <div className="w-full h-50">
                  {item.screenshotUrl && (
                    <img
                      src={item.screenshotUrl || ''}
                      alt={item.title}
                      className="size-full object-center object-cover rounded-t-[12px]"
                    />
                  )}
                </div>
                <CardContent className="px-2 h-10">
                  <CardTitle className="line-clamp-2">
                    {item.title || item.url}
                  </CardTitle>
                </CardContent>
                <CardFooter className="px-2">
                  <div className="flex justify-between items-center text-foreground/50">
                    <div>
                      <div>
                        {formatDistance(item._creationTime, new Date(), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div></div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
});

export default Home;
