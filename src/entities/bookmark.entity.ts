import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '~/entities/abstract.entity';
import { Author } from '~/entities/author.entity';

export type BookmarkType = 'photo' | 'video';

@Entity()
export class Bookmark extends AbstractEntity {
  @Column()
  type: BookmarkType;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ type: 'text' })
  thumbnailUrl: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column({ nullable: true })
  duration?: number;

  /**
   * Relations
   */
  @ManyToOne(() => Author, (author) => author.bookmarks)
  author: Promise<Author>;
}
