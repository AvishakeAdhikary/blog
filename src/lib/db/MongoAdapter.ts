import type { Comment, DbAdapter } from './types';
import { NotImplementedError } from './types';

export class MongoAdapter implements DbAdapter {
  name = 'mongo';
  async getLikes(_postSlug: string): Promise<number> { throw new NotImplementedError('MongoAdapter.getLikes'); }
  async hasLiked(_postSlug: string): Promise<boolean> { throw new NotImplementedError('MongoAdapter.hasLiked'); }
  async like(_postSlug: string): Promise<number> { throw new NotImplementedError('MongoAdapter.like'); }
  async unlike(_postSlug: string): Promise<number> { throw new NotImplementedError('MongoAdapter.unlike'); }
  async getViews(_postSlug: string): Promise<number> { throw new NotImplementedError('MongoAdapter.getViews'); }
  async incrementViews(_postSlug: string): Promise<number> { throw new NotImplementedError('MongoAdapter.incrementViews'); }
  async listComments(_postSlug: string): Promise<Comment[]> { throw new NotImplementedError('MongoAdapter.listComments'); }
  async addComment(_postSlug: string, _body: string, _authorName: string): Promise<Comment> { throw new NotImplementedError('MongoAdapter.addComment'); }
}
