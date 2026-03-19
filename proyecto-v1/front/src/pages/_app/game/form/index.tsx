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
import { GAMES_REVIEWS_PUT } from "@/types/games_reviews_endpoint";

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "El título debe tener al menos 5 caracteres.")
      .max(255, "El título debe tener como máximo 255 caracteres."),
    description: z
      .string()
      .min(50, "La descripción debe tener al menos 50 caracteres.")
      .max(510, "La descripción debe tener como máximo 510 caracteres."),
    rating_id: z.string().min(1, "La puntuación es requerida."),
    api_game_id: z.string().min(1, "El id de juego es requerido."),
  })
  .required();

const GameFormDialog = ({
  open,
  payload,
  setOpen,
  game_id,
  on_success,
}: {
  open: boolean;
  payload?: GAMES_REVIEWS_PUT;
  setOpen: (open: boolean) => void;
  game_id: string;
  on_success: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rating_id: "",
      api_game_id: "",
    },
  });

  const { fetch, loading } = useFetcher<{ token: string }>(
    payload ? `games_reviews/${payload.id}` : "games_reviews",
    payload ? "PUT" : "POST"
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await fetch(values);
    if (data) {
      on_success();
    }
    if (error) {
      form.setError("root", { message: error });
    }
  }

  const {
    fetch: fetchRatings,
    loading: loadingRatings,
    data: dataRatings,
  } = useFetcher<{ id: number; description: string }[]>(
    "games_reviews_ratings",
    "GET"
  );

  useEffect(() => {
    form.reset();
    fetchRatings();
    if (payload) {
      form.setValue("title", payload.title);
      form.setValue("description", payload.description);
      form.setValue("rating_id", `${payload.rating_id}`);
    }
    if (game_id) {
      form.setValue("api_game_id", game_id);
    }
  }, [open]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{payload ? "Modificar" : "Agregar"} reseña</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="El mejor juego de la historia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      style={{ resize: "none" }}
                      placeholder="Este juego me ha gustado mucho porque..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puntuación</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingRatings}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {loadingRatings && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <SelectValue placeholder="Seleccione una puntuación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataRatings?.map((rating) => (
                        <SelectItem key={rating.id} value={`${rating.id}`}>
                          {rating.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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

export default GameFormDialog;
