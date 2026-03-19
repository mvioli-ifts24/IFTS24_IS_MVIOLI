import Gamecard from "@/components/gamecard";
import GamecardSkeleton from "@/components/gamecard/skeleton";
import useFetcher from "@/hooks/useFetcher";
import { GAMES_INDEX } from "@/types/games_endpoint";
import { useEffect } from "react";

const All = ({ search }: { search: string }) => {
  const { fetch, loading, data } = useFetcher<GAMES_INDEX>("games", "GET");

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
        ?.filter((game) =>
          game.title.toUpperCase().includes(search.toUpperCase())
        )
        ?.map((game) => (
          <Gamecard
            game_id={game.id}
            thumbnail_src={game.thumbnail}
            title={game.title}
            key={game.id}
          />
        ))}
    </div>
  );
};

export default All;
