import { Separator } from "@/components/ui/separator";
import useFetcher from "@/hooks/useFetcher";
import { useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Gamecard from "@/components/gamecard";
import { GAMES_REVIEWS_BY_USER_GET } from "@/types/games_reviews_endpoint";
import { useEffect, useState } from "react";
import { USERS_SHOW } from "@/types/users_endpoint";
import { Button } from "@/components/ui/button";
import ProfileFormDialog from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import GenericDialog from "@/components/generic_dialog";
import { Loader2 } from "lucide-react";
import { removeAuth } from "@/lib/auth";

const ProfilePage = () => {
  const { user_id } = useParams();
  const { fetch: fetchReviews, data: dataReviews } =
    useFetcher<GAMES_REVIEWS_BY_USER_GET>(
      "games_reviews/user" + (user_id ? `/${user_id}` : ""),
      "GET"
    );
  const {
    fetch: fetchUser,
    data: dataUser,
    loading: loadingUser,
  } = useFetcher<USERS_SHOW>(
    "users" + (user_id ? `/${user_id}` : "/own"),
    "GET"
  );
  useEffect(() => {
    fetchReviews();
    fetchUser();
  }, [user_id]);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const { fetch: fetchDelUser, loading: loadingDelUser } =
    useFetcher<USERS_SHOW>("users" + (user_id ? `/${user_id}` : ""), "PATCH");
  const navigate = useNavigate();
  const handleDeleteProfile = async () => {
    await fetchDelUser({ disable: 1 });
    removeAuth();
    navigate("/");
  };
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState<boolean>(false);
  const handleLogout = () => {
    removeAuth();
    navigate("/");
  };
  return (
    <div className="w-full max-w-[1080px] flex flex-col items-center gap-8">
      {loadingUser && (
        <div className="flex gap-4 max-w-full">
          <Skeleton className="h-56 w-56" />
          <Skeleton className="h-16 w-40" />
        </div>
      )}
      {!loadingUser && dataUser && (
        <>
          <div className="flex gap-4 w-full justify-center">
            <div
              className="w-full max-w-56 bg-cover h-56"
              style={{
                backgroundImage: `url(${dataUser.profile_picture_url})`,
              }}
            ></div>
            <div className="flex flex-col gap-4 justify-between">
              <div>
                <p className="font-bold">{dataUser.email}</p>
                <p className="italic">{dataUser.gender_label}</p>
              </div>
              {!user_id && (
                <div className="flex gap-2 flex-col">
                  <Button onClick={() => setOpenEdit(true)}>
                    Editar perfil
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    Eliminar perfil
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLogoutConfirmOpen(true)}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div>
            <p>
              {dataUser.about
                ? dataUser.about
                : "Esta persona aún no cargo su descripción!"}
            </p>
          </div>
        </>
      )}
      {user_id && (
        <>
          <Separator />
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-[1080px]"
          >
            <CarouselContent>
              {dataReviews?.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Gamecard
                    game_id={review.api_game_id}
                    thumbnail_src={review.game_thumbnail}
                    title={review.game_title}
                    key={review.api_game_id}
                    review={review}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </>
      )}
      <ProfileFormDialog
        open={openEdit}
        setOpen={setOpenEdit}
        on_success={() => {
          setOpenEdit(false);
          fetchUser();
        }}
        payload={dataUser!}
      />
      <GenericDialog
        title="Atención"
        text="Al confirmar esta acción se borrara el perfil pero se conservaran las reseñas y datos. Luego podra comunicarse con un administrador para volver a habilitarlo."
        open={deleteConfirmOpen}
        set_open={setDeleteConfirmOpen}
        key={1}
      >
        <Button
          onClick={async () => {
            await handleDeleteProfile();
          }}
          disabled={loadingDelUser}
          className="self-end"
        >
          {loadingDelUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar
        </Button>
      </GenericDialog>
      <GenericDialog
        title="Atención"
        text="Al confirmar esta acción se cerrara la sesión."
        open={logoutConfirmOpen}
        set_open={setLogoutConfirmOpen}
        key={2}
      >
        <Button
          onClick={() => {
            handleLogout();
          }}
          className="self-end"
        >
          Confirmar
        </Button>
      </GenericDialog>
    </div>
  );
};

export default ProfilePage;
