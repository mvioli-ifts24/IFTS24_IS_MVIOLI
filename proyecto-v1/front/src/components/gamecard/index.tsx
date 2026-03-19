import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from "@/types/games_reviews_endpoint";
import { RatingToColor } from "@/utils/rating_to_color.enum";
import { Link } from "react-router-dom";

const Gamecard = ({
  game_id,
  thumbnail_src,
  title,
  review,
}: {
  game_id: number;
  thumbnail_src: string;
  title: string;
  review?: Review;
}) => {
  return (
    <Link className=" flex-grow min-w-[210px]" to={`/game/${game_id}`}>
      <Card className="hover:bg-slate-200 hover:cursor-pointer">
        <CardHeader>
          <div
            style={{ backgroundImage: `url(${thumbnail_src})` }}
            className="bg-center h-64 bg-cover rounded"
          ></div>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        {review ? (
          <CardContent>
            <p className="font-bold truncate">{review.title}</p>
            <p
              className="font-bold truncate"
              style={{ color: RatingToColor[review.rating_id] }}
            >
              {review.rating}
            </p>
            <div className="min-h-28 max-h-28 overflow-y-auto text-wrap break-words">
              {review.description}
            </div>
          </CardContent>
        ) : (
          <></>
        )}
      </Card>
    </Link>
  );
};

export default Gamecard;
