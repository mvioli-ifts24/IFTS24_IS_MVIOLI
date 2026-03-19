import ReviewCard from "@/components/reviewcard";
import ReviewCardSkeleton from "@/components/reviewcard/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useFetcher from "@/hooks/useFetcher";
import { GAMES_SHOW } from "@/types/games_endpoint";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameFormDialog from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import GenericDialog from "@/components/generic_dialog";
import { Loader2 } from "lucide-react";
import { GAMES_REVIEWS_BY_GAME_GET } from "@/types/games_reviews_endpoint";

const GamePage = () => {
  const { game_id } = useParams();

  const {
    fetch: fetchGame,
    loading: loadingGame,
    data: dataGame,
  } = useFetcher<GAMES_SHOW>(`games/${game_id}`, "GET");

  const {
    fetch: fetchReviews,
    loading: loadingReviews,
    data: dataReviews,
  } = useFetcher<GAMES_REVIEWS_BY_GAME_GET>(
    `games_reviews/game/${game_id}`,
    "GET"
  );

  const { fetch: fetchDel, loading: loadingDel } = useFetcher(
    `games_reviews/${dataReviews?.ownReview?.id}`,
    "DELETE"
  );

  useEffect(() => {
    fetchGame();
    fetchReviews();
  }, []);

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleDeleteReview = async () => {
    await fetchDel();
    setDeleteConfirmOpen(false);
    fetchReviews();
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-grow flex-col gap-4 max-w-[1080px] w-full">
      {loadingGame && <ReviewCardSkeleton />}
      {dataGame ? (
        <Card className="w-full h-max sticky top-24">
          <CardHeader className="flex flex-row gap-4">
            <div
              style={{ backgroundImage: `url(${dataGame.thumbnail})` }}
              className="justify-between w-full bg-cover gap-4 bg-center bg-local rounded-lg flex items-center justify-center flex-col"
            >
              <CardTitle className="bg-white/80 p-4 text-center rounded-b-lg">
                {dataGame.title}
              </CardTitle>
              <p className="bg-white/80 p-4 text-center rounded-t-lg">
                {dataGame.short_description}
              </p>
            </div>
          </CardHeader>
          <CardFooter className="justify-center gap-4">
            {loadingReviews ? (
              <Skeleton className="w-48 h-10" />
            ) : (
              <>
                {dataReviews?.ownReview ? (
                  <>
                    <Button onClick={() => handleOpenForm()}>
                      Modificar reseña
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      Eliminar reseña
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleOpenForm()}>
                    Agregar reseña
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      ) : (
        <></>
      )}
      {loadingReviews && <ReviewCardSkeleton />}
      {!loadingReviews && (
        <>
          {dataReviews?.ownReview ? (
            <ReviewCard
              description={dataReviews.ownReview.description}
              is_own={true}
              rating_id={dataReviews.ownReview.rating_id}
              rating_label={dataReviews.ownReview.rating}
              title={dataReviews.ownReview.title}
              user_label={dataReviews.ownReview.user_email}
              user_id={dataReviews.ownReview.user_id}
              key={dataReviews.ownReview.id}
            />
          ) : (
            <></>
          )}
        </>
      )}
      {dataReviews?.othersReviews.map((review) => (
        <ReviewCard
          description={review.description}
          is_own={false}
          rating_id={review.rating_id}
          rating_label={review.rating}
          title={review.title}
          user_label={review.user_email}
          user_id={review.user_id}
          key={review.id}
        />
      ))}
      <GameFormDialog
        game_id={game_id!}
        open={formOpen}
        setOpen={setFormOpen}
        on_success={() => {
          setFormOpen(false);
          fetchReviews();
        }}
        payload={dataReviews?.ownReview}
      />
      <GenericDialog
        title="Atención"
        text="Al confirmar esta acción se borrara la reseña."
        open={deleteConfirmOpen}
        set_open={setDeleteConfirmOpen}
      >
        <Button
          onClick={async () => {
            await handleDeleteReview();
          }}
          disabled={loadingDel}
          className="self-end"
        >
          {loadingDel && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar
        </Button>
      </GenericDialog>
    </div>
  );
};

export default GamePage;
