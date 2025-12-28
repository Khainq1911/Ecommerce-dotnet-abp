export class LoginDto {
  username!: string;
  password!: string;
}

export interface LoginResponseDto {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
