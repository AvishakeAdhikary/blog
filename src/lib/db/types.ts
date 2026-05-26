export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`Not implemented: ${method}`);
    this.name = 'NotImplementedError';
  }
}

export interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface DbAdapter {
  name: string;
  getLikes(postSlug: string): Promise<number>;
  hasLiked(postSlug: string): Promise<boolean>;
  like(postSlug: string): Promise<number>;
  unlike(postSlug: string): Promise<number>;
  getViews(postSlug: string): Promise<number>;
  incrementViews(postSlug: string): Promise<number>;
  listComments(postSlug: string): Promise<Comment[]>;
  addComment(postSlug: string, body: string, authorName: string): Promise<Comment>;
}
