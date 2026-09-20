export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface updateData {
  id: number;
  name: string;
  bio: string;
  pfp: string;
  username: string;
}

export interface UserPasswordOrEmail {
  email?: string;
  password?: string;
}
