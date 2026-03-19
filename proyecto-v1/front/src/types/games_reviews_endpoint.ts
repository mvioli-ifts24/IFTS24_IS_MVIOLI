export type GAMES_REVIEWS_POST = {
  title: string;
  description: string;
  rating_id: number;
  api_game_id: number;
};

export type GAMES_REVIEWS_PUT = GAMES_REVIEWS_POST & { id: number };

export type GAMES_REVIEWS_BY_GAME_GET = {
  ownReview: Review;
  othersReviews: Review[];
};

export type GAMES_REVIEWS_BY_USER_GET = Review[];

export type Review = {
  id: number;
  title: string;
  description: string;
  rating_id: number;
  api_game_id: number;
  user_id: number;
  rating: string;
  user_email: string;
  game_title: string;
  game_thumbnail: string;
};
