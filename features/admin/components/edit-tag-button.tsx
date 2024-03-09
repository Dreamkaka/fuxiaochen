'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { LoadingSpinner } from '@/components/loading-spinner';

import { toSlug } from '@/utils/helper';

import {
  type UpdateTagDTO,
  updateTagSchema,
  useGetTag,
  useUpdateTag,
} from '@/features/tag';

type EditTagButtonProps = {
  id: string;
};

export const EditTagButton = ({ id }: EditTagButtonProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<UpdateTagDTO>({
    resolver: zodResolver(updateTagSchema),
  });

  const { data, isLoading } = useGetTag(id);

  const updateTagQuery = useUpdateTag();

  React.useEffect(() => {
    if (open && data?.tag) {
      const { tag } = data;
      form.setValue('name', tag.name);
      form.setValue('slug', tag.slug);
      form.setValue('id', tag.id);
      form.clearErrors();
    }
  }, [data, form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant="ghost" onClick={() => setOpen(true)}>
          <PencilIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LoadingSpinner loading={isLoading} />
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form autoComplete="off">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>id</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input
                        className="flex-1"
                        placeholder="请输入标签名称"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>slug</FormLabel>
                    <FormControl>
                      <div className="flex items-center w-full gap-4">
                        <Input placeholder="请输入标签slug" {...field} />
                        <Button type="button" onClick={formatSlug}>
                          格式化
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(handleSubmit)()}
                  disabled={updateTagQuery.isPending}
                >
                  {updateTagQuery.isPending && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  保存
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  async function handleSubmit(values: UpdateTagDTO) {
    await updateTagQuery.mutateAsync(values);
    setOpen(false);
  }

  function formatSlug() {
    const tmp = form.getValues().slug?.trim();
    if (tmp) {
      const formatted = toSlug(tmp);
      form.setValue('slug', formatted);
    }
  }
};
