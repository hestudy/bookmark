import { Form } from '@/components/ui/form';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { useForm } from 'react-hook-form';

const AddLinkForm = (props: { onOk?: () => void }) => {
  const mutation = useMutation(api.link.addLink);

  const form = useForm<Parameters<typeof mutation>[0]>();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await mutation(values);
          props.onOk?.();
        })}
        className="flex flex-col gap-2"
      ></form>
    </Form>
  );
};

export default AddLinkForm;
