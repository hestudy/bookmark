import { ScrollArea } from '@/components/ui/scroll-area';
import { memo } from 'react';

const Home = memo(() => {
  return (
    <div className="size-full flex flex-col gap-2">
      <div></div>
      <ScrollArea className="flex-1">
        <div className="h-[1000px]">demo</div>
      </ScrollArea>
    </div>
  );
});

export default Home;
