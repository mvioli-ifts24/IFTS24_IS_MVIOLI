export type CONTACT_MESSAGES_INDEX = ContactMessage;

export type ContactMessage = {
  id: number;
  message: string;
  created_at: string;
  response: string | null;
  user_id: number;
  user_email: string;
};
