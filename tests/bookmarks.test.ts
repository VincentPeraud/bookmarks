import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import { AddEditBookmarkDto, BookmarkDto } from '~/dtos/bookmarks.dtos';
import { Pagination } from '~/dtos/pagination.dto';
import { Bookmark } from '~/entities/bookmark.entity';
import { server } from '~/index';
import { DatabaseService } from '~/services/database.service';
const expect = chai.expect;

chai.use(chaiHttp);

describe('Bookmarks', function () {
  let bookmarkId: string;
  const bookmarkDtoKeys = [
    'id',
    'type',
    'url',
    'title',
    'authorName',
    'authorUrl',
    'createdAt',
    'thumbnail',
    'width',
    'height',
  ];

  before(function (done) {
    void server.then((app) => {
      this.app = app;

      done();
    });
  });

  it('Create bookmark (Vimeo)', function (done) {
    const url = 'https://vimeo.com/147000414';
    const dto: AddEditBookmarkDto = { url };

    void chai
      .request(this.app)
      .post('/bookmarks')
      .send(dto)
      .auth(process.env.OAUTH_USER, process.env.OAUTH_PASSWORD)
      .end(async function (err, { status, body }) {
        expect(err).to.be.null;
        expect(status).to.equal(201);

        const bookmark = await DatabaseService.getManager().findOne(Bookmark, { where: { url } });
        expect(bookmark).to.be.not.null;

        expect(body).to.not.be.null;
        for (const prop of bookmarkDtoKeys) {
          expect(body).to.have.property(prop);
        }

        done();
      });
  });

  it('Create bookmark (Flickr)', function (done) {
    const url = 'https://flickr.com/photos/vinchey/3193201837';
    const dto: AddEditBookmarkDto = { url };

    void chai
      .request(this.app)
      .post('/bookmarks')
      .send(dto)
      .auth(process.env.OAUTH_USER, process.env.OAUTH_PASSWORD)
      .end(async function (err, { status, body }) {
        expect(err).to.be.null;
        expect(status).to.equal(201);

        const bookmark = await DatabaseService.getManager().findOne(Bookmark, { where: { url } });
        expect(bookmark).to.be.not.null;

        expect(body).to.not.be.null;
        for (const prop of bookmarkDtoKeys) {
          expect(body).to.have.property(prop);
        }

        bookmarkId = bookmark.id;

        done();
      });
  });

  it('Get bookmark detail', function (done) {
    void chai
      .request(this.app)
      .get('/bookmarks/' + bookmarkId)
      .auth(process.env.OAUTH_USER, process.env.OAUTH_PASSWORD)
      .end(function (err, { status, body }) {
        expect(err).to.be.null;
        expect(status).to.equal(200);

        expect(body).to.not.be.null;
        for (const prop of bookmarkDtoKeys) {
          expect(body).to.have.property(prop);
        }

        done();
      });
  });

  it('Get bookmarks list', function (done) {
    void chai
      .request(this.app)
      .get('/bookmarks/1/10')
      .auth(process.env.OAUTH_USER, process.env.OAUTH_PASSWORD)
      .end(function (err, { status, body }: { status: number; body: Pagination<BookmarkDto> }) {
        expect(err).to.be.null;
        expect(status).to.equal(200);

        expect(body.items).to.be.an('array');
        for (const item of body.items) {
          expect(item).to.not.be.null;
          for (const prop of bookmarkDtoKeys) {
            expect(item).to.have.property(prop);
          }
        }

        done();
      });
  });
});
