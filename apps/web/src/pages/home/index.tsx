import AddLinkFormPopover from '@/components/link-form/add-link-form/add-link-form-popover';
import LinkGrid from '@/components/link-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from 'convex/_generated/api';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router';

const Home = memo(() => {
  const query = usePaginatedQuery(
    api.link.getLinkPage,
    {},
    {
      initialNumItems: 20,
    },
  );

  const scrapyLink = useMutation(api.link.scrapyLink);

  const deleteLink = useMutation(api.link.deleteLink);

  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <div>
          <Link to={'/search'}>
            <Input readOnly placeholder="To Search..." />
          </Link>
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
        <LinkGrid links={query.results} />
      </ScrollArea>
    </div>
  );
});

export default Home;
