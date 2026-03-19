export type USERS_SHOW = User;

export type User = {
  id: number;
  email: string;
  gender_id: number;
  is_admin: number;
  gender_label: string;
  about: string | null;
  profile_picture_url: string;
  deleted_at: Date | null;
  accept_newsletter: boolean;
};
