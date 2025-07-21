import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  memo,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from 'react';
import AddLinkForm from './add-link-form';

const AddLinkFormPopover = memo(
  ({
    children,
    ...props
  }: PropsWithChildren<ComponentProps<typeof AddLinkForm>>) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
          <AddLinkForm
            {...props}
            onOk={(...args) => {
              setOpen(false);
              props.onOk?.(...args);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

export default AddLinkFormPopover;
