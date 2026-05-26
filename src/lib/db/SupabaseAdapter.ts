import type { Comment, DbAdapter } from './types';
import { NotImplementedError } from './types';

export class SupabaseAdapter implements DbAdapter {
  name = 'supabase';
  async getLikes(_postSlug: string): Promise<number> { throw new NotImplementedError('SupabaseAdapter.getLikes'); }
  async hasLiked(_postSlug: string): Promise<boolean> { throw new NotImplementedError('SupabaseAdapter.hasLiked'); }
  async like(_postSlug: string): Promise<number> { throw new NotImplementedError('SupabaseAdapter.like'); }
  async unlike(_postSlug: string): Promise<number> { throw new NotImplementedError('SupabaseAdapter.unlike'); }
  async getViews(_postSlug: string): Promise<number> { throw new NotImplementedError('SupabaseAdapter.getViews'); }
  async incrementViews(_postSlug: string): Promise<number> { throw new NotImplementedError('SupabaseAdapter.incrementViews'); }
  async listComments(_postSlug: string): Promise<Comment[]> { throw new NotImplementedError('SupabaseAdapter.listComments'); }
  async addComment(_postSlug: string, _body: string, _authorName: string): Promise<Comment> { throw new NotImplementedError('SupabaseAdapter.addComment'); }
}
