import Gamecard from "@/components/gamecard";
import GamecardSkeleton from "@/components/gamecard/skeleton";
import useFetcher from "@/hooks/useFetcher";
import { GAMES_REVIEWS_BY_USER_GET } from "@/types/games_reviews_endpoint";
import { useEffect } from "react";

const Reviewed = ({ search }: { search: string }) => {
  const { fetch, loading, data } = useFetcher<GAMES_REVIEWS_BY_USER_GET>(
    "games_reviews/user",
    "GET"
  );

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="flex flex-wrap gap-6">
      {loading &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((fakeN) => (
          <GamecardSkeleton fakeN={fakeN} key={fakeN} />
        ))}
      {data
        ?.filter((review) =>
          review.game_title.toUpperCase().includes(search.toUpperCase())
        )
        ?.map((review) => (
          <Gamecard
            game_id={review.api_game_id}
            thumbnail_src={review.game_thumbnail}
            title={review.game_title}
            key={review.id}
          />
        ))}
    </div>
  );
};

export default Reviewed;
