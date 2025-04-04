export interface IOrg {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrgRequest {
  name: string;
  userId: string;
}

export interface IOrgResponse {
  id: string;
  name: string;
}
