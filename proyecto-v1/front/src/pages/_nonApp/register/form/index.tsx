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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { MAX_FILE_SIZE, checkFileType } from "@/utils/file_upload_input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    email: z
      .string()
      .email("El correo provisto no cumple el formato de email."),
    password: z
      .string()
      .min(6, "La contraseña requiere al menos 6 caracteres."),
    repeat_password: z.string({
      required_error: "La contraseña es requerida.",
    }),
    gender_id: z.string().min(1, "El género es requerido."),
    profile_picture: z
      .any()
      .refine((file) => file?.size > 0, "La imagen es requerida.")
      .refine((file) => file.size < MAX_FILE_SIZE, "El tamaño máximo es 1MB.")
      .refine(
        (file) => checkFileType(file),
        "Solo se pueden subir archivos de tipo .jpg, .jpeg y .png."
      ),
    accept_newsletter: z.boolean(),
  })
  .required()
  .refine((data) => data.password === data.repeat_password, {
    message: "Las contraseñas no coinciden.",
    path: ["repeat_password"],
  });

const Form = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      repeat_password: "",
      gender_id: "",
      profile_picture: "",
      accept_newsletter: false,
    },
  });

  const { fetch, loading } = useFetcher<{ token: string }>(
    "auth/register",
    "POST"
  );
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = new FormData();
    Object.keys(values).forEach((key) =>
      payload.append(key, values[key as keyof typeof values])
    );
    const { data, error } = await fetch(payload, "formdata");
    if (data?.token) {
      setAuth(data.token);
      navigate("/home");
    }
    if (error) {
      form.setError("root", { message: error });
    }
  }

  const {
    fetch: fetchGenders,
    loading: loadingGenders,
    data: dataGenders,
  } = useFetcher<{ id: number; label: string }[]>("users_genders", "GET");

  useEffect(() => {
    fetchGenders();
  }, []);

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
        <FormField
          control={form.control}
          name="repeat_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetir contraseña</FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loadingGenders}
              >
                <FormControl>
                  <SelectTrigger>
                    {loadingGenders && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <SelectValue placeholder="Seleccione un género" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataGenders?.map((gender) => (
                    <SelectItem key={gender.id} value={`${gender.id}`}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen de perfil</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    field.onChange(e.target?.files![0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accept_newsletter"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <FormControl>
                <Checkbox
                  className="self-end"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
              <FormLabel>Suscribirme al RSS de noticias gamer</FormLabel>
            </FormItem>
          )}
        />
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        <Button style={{ width: "100%" }} type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </form>
    </UIForm>
  );
};

export default Form;
