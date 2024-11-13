export interface User {
  user_id: string;
  firstname: string;
  surname: string;
  email: string;
  doc_type: "CC" | "CE" | "PA";
  doc_num: number;
  phone_number: number;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Role: {
    name: string;
    path: string;
  };
}