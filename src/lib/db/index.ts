import type { DbAdapter } from './types';
import { LocalAdapter } from './LocalAdapter';
import { PrismaAdapter } from './PrismaAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';
import { FirebaseAdapter } from './FirebaseAdapter';
import { MongoAdapter } from './MongoAdapter';
import { dbAdapterName } from '../env';

let instance: DbAdapter | null = null;

export function getDb(): DbAdapter {
  if (instance) return instance;
  switch (dbAdapterName) {
    case 'prisma':
      instance = new PrismaAdapter();
      break;
    case 'supabase':
      instance = new SupabaseAdapter();
      break;
    case 'firebase':
      instance = new FirebaseAdapter();
      break;
    case 'mongo':
      instance = new MongoAdapter();
      break;
    case 'local':
    default:
      instance = new LocalAdapter();
      break;
  }
  return instance;
}

export type { DbAdapter, Comment } from './types';
export { NotImplementedError } from './types';
