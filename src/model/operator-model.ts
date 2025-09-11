export type OperatorResponse = {
  id: number;
  nik: string;
  name: string;
  username: string;
};

export type CreateOperatorRequest = {
  nik: string;
  name: string;
  username: string;
  password: string;
};

export type UpdateOperatorRequest = {
  name?: string;
  nik?: string;
  username?: string;
  password?: string;
};

export type SearchOperatorRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
};

export function toOperatorResponse(operator: any): OperatorResponse {
  return {
    id: operator.id,
    name: operator.name,
    nik: operator.nik,
    username: operator.user?.username || "",
  };
}
