import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { memo, type ComponentProps, type PropsWithChildren } from 'react';
import LinkDetail from './link-detail';

const LinkDetailSheet = memo(
  ({
    children,
    ...props
  }: PropsWithChildren<ComponentProps<typeof LinkDetail>>) => {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[90%] flex flex-col w-[90%]">
          <DialogHeader>
            <DialogTitle>Link Detail</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-0">
            <LinkDetail {...props} />
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

export default LinkDetailSheet;
