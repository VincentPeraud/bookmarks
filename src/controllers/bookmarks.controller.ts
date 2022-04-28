import { Router } from 'express';
import { AddEditBookmarkDto } from '~/dtos/bookmarks.dtos';
import { BookmarksService } from '~/services/bookmarks.service';
import { Utils } from '~/utils';

const BookmarksController = Router();
const bookmarksService = new BookmarksService();

BookmarksController.get('/:page/:limit', (req, res, next) => {
  bookmarksService
    .list(+req.params.page, +req.params.limit)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

BookmarksController.get('/:id', (req, res, next) => {
  bookmarksService
    .getBookmark(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

BookmarksController.post('/', (req, res, next) => {
  const dto = Utils.dtoFromRequest(AddEditBookmarkDto, req);

  bookmarksService
    .create(dto)
    .then((result) => res.status(201).json(result))
    .catch(next);
});

BookmarksController.put('/:id', (req, res, next) => {
  const dto = Utils.dtoFromRequest(AddEditBookmarkDto, req);
  bookmarksService
    .update(req.params.id, dto)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

BookmarksController.delete('/:id', (req, res, next) => {
  bookmarksService
    .softRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

export { BookmarksController };
