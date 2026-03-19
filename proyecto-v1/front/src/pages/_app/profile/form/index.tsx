import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetcher from "@/hooks/useFetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { User } from "@/types/users_endpoint";
import { MAX_FILE_SIZE, checkFileType } from "@/utils/file_upload_input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    gender_id: z.string().min(1, "El género es requerido."),
    about: z.string().max(145, "Solo puede contener hasta 145 caracteres."),
    profile_picture: z
      .any()
      .refine(
        (file) => file?.size || 0 < MAX_FILE_SIZE,
        "El tamaño máximo es 1MB."
      )
      .refine(
        (file) => (file ? checkFileType(file) : true),
        "Solo se pueden subir archivos de tipo .jpg, .jpeg y .png."
      ),
    accept_newsletter: z.boolean(),
  })
  .required();

const ProfileFormDialog = ({
  open,
  payload,
  setOpen,
  on_success,
}: {
  open: boolean;
  payload: User;
  setOpen: (open: boolean) => void;
  on_success: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender_id: "",
      about: "",
      profile_picture: "",
      accept_newsletter: false,
    },
  });

  const { fetch, loading } = useFetcher(`users`, "PUT");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = new FormData();
    Object.keys(values).forEach((key) =>
      payload.append(key, values[key as keyof typeof values])
    );

    const { data, error } = await fetch(payload, "formdata");
    if (data) {
      on_success();
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
    form.reset();
    if (payload) {
      form.setValue("about", payload.about ?? "");
      form.setValue("gender_id", String(payload.gender_id));
      form.setValue("accept_newsletter", !!payload.accept_newsletter);
    }
    fetchGenders();
  }, [open]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
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
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobre tí</FormLabel>
                  <FormControl>
                    <Textarea
                      style={{ resize: "none" }}
                      placeholder="Soy un aficionado a los videojuegos..."
                      {...field}
                    />
                  </FormControl>
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
            <Button type="submit" disabled={loading} className="self-end">
              {" "}
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileFormDialog;
