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
import { Input } from "@/components/ui/input";
import useFetcher from "@/hooks/useFetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { setAuth } from "@/lib/auth";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, "El correo es requerido.")
      .email("El correo provisto no cumple el formato de email."),
    password: z.string().min(1, "La contraseña es requerida."),
  })
  .required();

const Form = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { fetch, loading } = useFetcher<{ token: string }>(
    "auth/login",
    "POST"
  );
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await fetch(values);
    if (data?.token) {
      setAuth(data.token);
      navigate("/home");
    }
    if (error) {
      form.setError("root", { message: error });
    }
  }

  return (
    <UIForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        <Button style={{ width: "100%" }} type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ingresar
        </Button>
      </form>
    </UIForm>
  );
};

export default Form;
