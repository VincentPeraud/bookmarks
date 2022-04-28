import axios from 'axios';
import { FindManyOptions, IsNull, Not } from 'typeorm';
import { AddEditBookmarkDto, BookmarkDto } from '~/dtos/bookmarks.dtos';
import { Oembed } from '~/dtos/oembed.dto';
import { Pagination } from '~/dtos/pagination.dto';
import { Author } from '~/entities/author.entity';
import { Bookmark } from '~/entities/bookmark.entity';
import { HttpException } from '~/exceptions/http.exception';
import { DatabaseService } from '~/services/database.service';
import { Utils } from '~/utils';

export class BookmarksService {
  manager = DatabaseService.getManager();

  async list(page: number, limit: number): Promise<Pagination<BookmarkDto>> {
    const options: FindManyOptions<Bookmark> = { where: { deletedAt: IsNull() } };
    const totalItems = await this.manager.count(Bookmark, options);
    const items = await this.manager.find(
      Bookmark,
      options && { skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' } },
    );

    return {
      items: await Promise.all(
        items.map(async (item) => await BookmarkDto.fromBookmarkEntity(item)),
      ),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async create(dto: AddEditBookmarkDto): Promise<BookmarkDto> {
    const exists = await this.manager.findOne(Bookmark, {
      where: { url: dto.url, deletedAt: IsNull() },
    });
    Utils.assert(!exists, 400, `Bookmark with url ${dto.url} already exists`);

    const oembed = await this._getOembed(dto.url);
    const bookmark = new Bookmark();
    await this._hydrateAndSaveBookmark(bookmark, dto.url, oembed);

    return BookmarkDto.fromBookmarkEntity(bookmark);
  }

  async getBookmark(bookmarkId: string): Promise<BookmarkDto> {
    const bookmark = await this._fetchBookmarkById(bookmarkId);

    return BookmarkDto.fromBookmarkEntity(bookmark);
  }

  async update(bookmarkId: string, dto: AddEditBookmarkDto): Promise<BookmarkDto> {
    const exists = await this.manager.findOne(Bookmark, {
      where: { id: Not(bookmarkId), url: dto.url, deletedAt: IsNull() },
    });
    Utils.assert(!exists, 400, `Bookmark with url ${dto.url} already exists`);

    const bookmark = await this._fetchBookmarkById(bookmarkId);

    const oembed = await this._getOembed(dto.url);
    await this._hydrateAndSaveBookmark(bookmark, dto.url, oembed);

    return BookmarkDto.fromBookmarkEntity(bookmark);
  }

  async softRemove(bookmarkId: string): Promise<void> {
    const bookmark = await this._fetchBookmarkById(bookmarkId);
    bookmark.deletedAt = new Date();
    await this.manager.save(bookmark);
  }

  private async _getOembed(url: string): Promise<Oembed> {
    try {
      const { data } = await axios.get<Oembed>(this._getOembedUrl(url));

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(500, `${error.code} - ${error.message}`);
      }
      throw error;
    }
  }

  private _getOembedUrl(url: string): string {
    if (new RegExp(/^https:\/\/(www\.)?vimeo.com/, 'i').test(url)) {
      return `https://vimeo.com/api/oembed.json?url=${url}`;
    } else if (new RegExp(/^https:\/\/(www\.)?flickr.com\/photos/, 'i').test(url)) {
      return `http://www.flickr.com/services/oembed/?format=json&url=${url}`;
    } else {
      throw new HttpException(400, 'Invalid bookmark url');
    }
  }

  private async _hydrateAndSaveBookmark(
    bookmark: Bookmark,
    url: string,
    oembed: Oembed,
  ): Promise<void> {
    let author = await this.manager.findOne(Author, {
      where: { name: oembed.author_name, url: oembed.author_url },
    });
    if (author === null) {
      author = new Author();
      author.name = oembed.author_name;
      author.url = oembed.author_url;
      await this.manager.save(author);
    }

    bookmark.author = Promise.resolve(author);
    bookmark.type = oembed.type;
    bookmark.url = url;
    bookmark.title = oembed.title;
    if (oembed.upload_date) {
      bookmark.publishedAt = new Date(oembed.upload_date);
    }
    bookmark.thumbnailUrl = oembed.thumbnail_url;
    bookmark.width = oembed.width;
    bookmark.height = oembed.height;
    if (oembed.duration) {
      bookmark.duration = oembed.duration;
    }

    await this.manager.save(bookmark);
  }

  private async _fetchBookmarkById(id: string): Promise<Bookmark> {
    const bookmark = await this.manager.findOne(Bookmark, { where: { id, deletedAt: IsNull() } });

    if (bookmark === null) {
      throw new HttpException(400, `Bookmark with id ${id} not found!`);
    }

    return bookmark;
  }
}
