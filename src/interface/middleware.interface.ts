export interface IJWT {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface IORG {
  orgId: string;
  iat: string;
  exp: string;
}

export interface IUSERORG {
  userOrgId: string;
  iat: string;
  exp: string;
}

export interface IPROFILE {
  email: string;
}
