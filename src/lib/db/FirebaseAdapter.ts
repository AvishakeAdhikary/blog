import type { Comment, DbAdapter } from './types';
import { NotImplementedError } from './types';

export class FirebaseAdapter implements DbAdapter {
  name = 'firebase';
  async getLikes(_postSlug: string): Promise<number> { throw new NotImplementedError('FirebaseAdapter.getLikes'); }
  async hasLiked(_postSlug: string): Promise<boolean> { throw new NotImplementedError('FirebaseAdapter.hasLiked'); }
  async like(_postSlug: string): Promise<number> { throw new NotImplementedError('FirebaseAdapter.like'); }
  async unlike(_postSlug: string): Promise<number> { throw new NotImplementedError('FirebaseAdapter.unlike'); }
  async getViews(_postSlug: string): Promise<number> { throw new NotImplementedError('FirebaseAdapter.getViews'); }
  async incrementViews(_postSlug: string): Promise<number> { throw new NotImplementedError('FirebaseAdapter.incrementViews'); }
  async listComments(_postSlug: string): Promise<Comment[]> { throw new NotImplementedError('FirebaseAdapter.listComments'); }
  async addComment(_postSlug: string, _body: string, _authorName: string): Promise<Comment> { throw new NotImplementedError('FirebaseAdapter.addComment'); }
}
