import { Users } from '@/routes/users/users.entity';

export const userPublicFields: (keyof Users)[] = [
  'id',
  'email',
  'username',
  'name',
  'surname',
];
