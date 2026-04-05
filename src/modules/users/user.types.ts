export interface UpdateRoleInput {
  role: "VIEWER" | "ANALYST" | "ADMIN";
}

export interface UpdateStatusInput {
  status: "ACTIVE" | "INACTIVE";
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}