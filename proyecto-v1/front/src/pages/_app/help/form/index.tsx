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
    message: z
      .string()
      .min(10, "El mensaje debe tener al menos 10 caracteres."),
  })
  .required();

const Form = ({ on_success }: { on_success: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { fetch: fetchSend, loading: loadingSend } = useFetcher<{
    token: string;
  }>("contact_messages", "POST");

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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  style={{ resize: "none" }}
                  placeholder="Tengo una pregunta respecto a..."
                  {...field}
                />
              </FormControl>
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
