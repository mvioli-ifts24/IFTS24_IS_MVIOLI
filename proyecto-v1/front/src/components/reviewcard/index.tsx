import { RatingToColor } from "@/utils/rating_to_color.enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";

const ReviewCard = ({
  title,
  rating_id,
  rating_label,
  description,
  user_label,
  is_own,
  user_id,
}: {
  title: string;
  rating_id: number;
  rating_label: string;
  description: string;
  user_label: string;
  user_id: number;
  is_own: boolean;
}) => {
  return (
    <Card
      style={is_own ? { borderColor: RatingToColor[rating_id] } : {}}
      className={is_own ? `border-4` : ""}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="font-bold" style={{ color: RatingToColor[rating_id] }}>
          {rating_label}
        </p>
      </CardHeader>
      <CardContent>
        <CardDescription className="max-h-28 overflow-y-auto text-wrap break-words ">
          {description}
        </CardDescription>
      </CardContent>
      {!is_own && (
        <CardFooter>
          <Link to={`/profile/${user_id}`}>
            <p>{user_label}</p>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReviewCard;
