import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form as UIForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import useFetcher from "@/hooks/useFetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z
  .object({
    response: z
      .string()
      .min(10, "El mensaje debe tener al menos 10 caracteres."),
  })
  .required();

const Form = ({
  on_success,
  contact_message_id,
}: {
  contact_message_id: number;
  on_success: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      response: "",
    },
  });

  const { fetch: fetchSend, loading: loadingSend } = useFetcher(
    `admin/contact_messages/${contact_message_id}`,
    "PATCH"
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await fetchSend(values);
    if (data) {
      on_success();
      form.reset();
    }
    if (error) {
      form.setError("root", { message: error });
    }
  }

  return (
    <UIForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>R:</FormLabel>
              <div className="p-1">
                <FormControl>
                  <Textarea
                    style={{ resize: "none" }}
                    placeholder="Hola, esto se debe a que.."
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        <Button className="self-end" type="submit" disabled={loadingSend}>
          {loadingSend && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar
        </Button>
      </form>
    </UIForm>
  );
};

export default Form;
