import { action, Schema } from '../src/';

export const authors = new Schema('authors', ['id'], action.GET);
export const books = new Schema('books', ['id'], action.GET, [authors]);
