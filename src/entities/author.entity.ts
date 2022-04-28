import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Bookmark } from './bookmark.entity';

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  /**
   * Inversed relations
   */

  @OneToMany(() => Bookmark, (bookmark) => bookmark.author)
  bookmarks: Promise<Bookmark[]>;
}
