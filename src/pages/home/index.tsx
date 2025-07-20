import AddLinkFormPopover from '@/components/link-form/add-link-form/add-link-form-popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { memo } from 'react';

const Home = memo(() => {
  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <div></div>
        <div>
          <AddLinkFormPopover>
            <Button size={'sm'}>
              <Plus /> add
            </Button>
          </AddLinkFormPopover>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="h-[1000px]">demo</div>
      </ScrollArea>
    </div>
  );
});

export default Home;
