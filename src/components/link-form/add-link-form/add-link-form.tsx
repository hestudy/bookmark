import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isURL } from 'validator';

const AddLinkForm = memo((props: { onOk?: () => void }) => {
  const mutation = useMutation(api.link.addLink);

  const form = useForm<Parameters<typeof mutation>[0]>({
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await mutation(values);
          toast.success('Link added');
          props.onOk?.();
        })}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="url"
          rules={{
            required: 'Link is required',
            validate: (v) => {
              if (!isURL(v)) {
                return 'Invalid url';
              }
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="http(s)://" {...field} />
              </FormControl>
              <FormDescription>input link you want to add</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Confirm</Button>
        </div>
      </form>
    </Form>
  );
});

export default AddLinkForm;
