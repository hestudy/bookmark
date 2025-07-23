import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { memo } from 'react';

const LinkDetail = memo((props: { id: Id<'links'> }) => {
  const query = useQuery(api.link.getLink, {
    linkId: props.id,
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70}>
        <ScrollArea className="h-full">
          <div
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{
              __html: query?.html || '',
            }}
          />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel></ResizablePanel>
    </ResizablePanelGroup>
  );
});

export default LinkDetail;
