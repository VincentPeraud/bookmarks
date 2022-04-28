import { IsString } from 'class-validator';
import { Bookmark, BookmarkType } from '~/entities/bookmark.entity';

export class BookmarkDto {
  id: string;
  type: BookmarkType;
  url: string;
  title: string;
  authorName: string;
  authorUrl: string;
  createdAt: Date;
  publishedAt: Date;
  thumbnail: string;
  width: number;
  height: number;
  duration?: number;

  static async fromBookmarkEntity(bookmark: Bookmark): Promise<BookmarkDto> {
    const {
      id,
      type,
      url,
      title,
      createdAt,
      publishedAt,
      thumbnailUrl: thumbnail,
      width,
      height,
      duration,
    } = bookmark;

    const { name: authorName, url: authorUrl } = await bookmark.author;

    return {
      id,
      type,
      url,
      title,
      authorName,
      authorUrl,
      createdAt,
      publishedAt,
      thumbnail,
      width,
      height,
      duration,
    };
  }
}

export class AddEditBookmarkDto {
  @IsString()
  url: string;
}
