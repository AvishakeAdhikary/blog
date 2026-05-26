import type { Comment, DbAdapter } from './types';
import { NotImplementedError } from './types';

export class PrismaAdapter implements DbAdapter {
  name = 'prisma';
  async getLikes(_postSlug: string): Promise<number> { throw new NotImplementedError('PrismaAdapter.getLikes'); }
  async hasLiked(_postSlug: string): Promise<boolean> { throw new NotImplementedError('PrismaAdapter.hasLiked'); }
  async like(_postSlug: string): Promise<number> { throw new NotImplementedError('PrismaAdapter.like'); }
  async unlike(_postSlug: string): Promise<number> { throw new NotImplementedError('PrismaAdapter.unlike'); }
  async getViews(_postSlug: string): Promise<number> { throw new NotImplementedError('PrismaAdapter.getViews'); }
  async incrementViews(_postSlug: string): Promise<number> { throw new NotImplementedError('PrismaAdapter.incrementViews'); }
  async listComments(_postSlug: string): Promise<Comment[]> { throw new NotImplementedError('PrismaAdapter.listComments'); }
  async addComment(_postSlug: string, _body: string, _authorName: string): Promise<Comment> { throw new NotImplementedError('PrismaAdapter.addComment'); }
}
