/* eslint-disable @typescript-eslint/naming-convention */

import { BookmarkType } from '~/entities/bookmark.entity';

export interface Oembed {
  type: BookmarkType;
  provider_name: string;
  title: string;
  author_name: string;
  author_url: string;
  width: number;
  height: number;
  duration?: number;
  thumbnail_url: string;
  upload_date?: string;
}
