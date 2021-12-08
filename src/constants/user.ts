import { Users } from '@/routes/users/users.entity';

export const userPublicFields: (keyof Users)[] = ['id', 'email'];

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,20}$/;
