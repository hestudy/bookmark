import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { memo } from 'react';

const Home = memo(() => {
  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex gap-2">
        <Button size={'sm'}>
          <Plus /> add
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="h-[1000px]">demo</div>
      </ScrollArea>
    </div>
  );
});

export default Home;
