import { CollectionReference } from 'firebase-admin/firestore';

export type Repository<T> = CollectionReference<T>;
