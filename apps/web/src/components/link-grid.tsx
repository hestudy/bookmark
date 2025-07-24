import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { api } from 'convex/_generated/api';
import { useMutation, type UsePaginatedQueryReturnType } from 'convex/react';
import { formatDistance } from 'date-fns';
import { MoreHorizontal, RefreshCcw, Scan, Trash } from 'lucide-react';
import { memo } from 'react';
import { toast } from 'sonner';
import LinkDetailSheet from './link-form/link-detail/link-detail-sheet';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardTitle } from './ui/card';

const LinkGrid = memo(
  (props: {
    links: UsePaginatedQueryReturnType<typeof api.link.getLinkPage>['results'];
  }) => {
    const scrapyLink = useMutation(api.link.scrapyLink);

    const deleteLink = useMutation(api.link.deleteLink);

    return (
      <div className="grid grid-cols-3 gap-4">
        {props.links.map((item) => {
          return (
            <Card key={item._id} className="pt-0 gap-4">
              <div
                className="w-full h-50 cursor-pointer"
                onClick={() => {
                  window.open(item.url, '_blank');
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl || ''}
                    alt={item.title}
                    className="size-full object-center object-cover rounded-t-[12px]"
                  />
                )}
                {!item.imageUrl && (
                  <>
                    {item.faviconUrl && (
                      <div className="size-full flex justify-center items-center">
                        <img
                          src={item.faviconUrl || ''}
                          alt={item.title}
                          className="size-20 object-center object-cover rounded-t-[12px]"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <CardContent className="px-2 h-10">
                <CardTitle className="line-clamp-2">
                  {item.title || item.url}
                </CardTitle>
              </CardContent>
              <CardFooter className="px-2">
                <div className="flex justify-between items-center text-foreground/50 w-full">
                  <div className="flex gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      className="hover:text-main"
                    >
                      {item.domain}
                    </a>
                    <div>
                      {formatDistance(item._creationTime, new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <LinkDetailSheet id={item._id}>
                      <Button size={'icon'} variant={'neutral'}>
                        <Scan />
                      </Button>
                    </LinkDetailSheet>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'neutral'}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            scrapyLink({
                              linkId: item._id,
                            }).then(() => {
                              toast.success('added queue');
                            });
                          }}
                        >
                          <RefreshCcw />
                          Refresh
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            deleteLink({
                              linkId: item._id,
                            });
                          }}
                        >
                          <Trash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  },
);

export default LinkGrid;
