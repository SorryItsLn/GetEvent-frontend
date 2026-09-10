export type CookieSettings = Partial<{
  path: string;
  domain: string;
  expires: string;
  'max-age': number;
  secure: true;
  samesite: true | 'strict' | 'lax';
}>;

export type CookieOptions = Partial<{
  path: string;
  domain: string;
  expires: number | Date; // seconds duration or end of life date
  secure: boolean;
  sameSite: boolean | 'strict' | 'lax';
}>;
