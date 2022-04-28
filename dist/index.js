var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  server: () => server
});
module.exports = __toCommonJS(src_exports);
var import_cors = __toESM(require("cors"));
var import_config2 = require("dotenv/config");
var import_express2 = __toESM(require("express"));
var import_express_basic_auth = __toESM(require("express-basic-auth"));

// src/controllers/bookmarks.controller.ts
var import_express = require("express");

// src/dtos/bookmarks.dtos.ts
var import_class_validator = require("class-validator");
var BookmarkDto = class {
  static async fromBookmarkEntity(bookmark) {
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
      duration
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
      duration
    };
  }
};
var AddEditBookmarkDto = class {
};
__decorateClass([
  (0, import_class_validator.IsString)()
], AddEditBookmarkDto.prototype, "url", 2);

// src/services/bookmarks.service.ts
var import_axios = __toESM(require("axios"));
var import_typeorm5 = require("typeorm");

// src/entities/author.entity.ts
var import_typeorm3 = require("typeorm");

// src/entities/abstract.entity.ts
var import_typeorm = require("typeorm");
var AbstractEntity = class {
};
__decorateClass([
  (0, import_typeorm.PrimaryGeneratedColumn)("uuid")
], AbstractEntity.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm.CreateDateColumn)()
], AbstractEntity.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm.UpdateDateColumn)()
], AbstractEntity.prototype, "updatedAt", 2);
__decorateClass([
  (0, import_typeorm.DeleteDateColumn)()
], AbstractEntity.prototype, "deletedAt", 2);

// src/entities/bookmark.entity.ts
var import_typeorm2 = require("typeorm");
var Bookmark = class extends AbstractEntity {
};
__decorateClass([
  (0, import_typeorm2.Column)()
], Bookmark.prototype, "type", 2);
__decorateClass([
  (0, import_typeorm2.Column)()
], Bookmark.prototype, "url", 2);
__decorateClass([
  (0, import_typeorm2.Column)()
], Bookmark.prototype, "title", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ nullable: true })
], Bookmark.prototype, "publishedAt", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "text" })
], Bookmark.prototype, "thumbnailUrl", 2);
__decorateClass([
  (0, import_typeorm2.Column)()
], Bookmark.prototype, "width", 2);
__decorateClass([
  (0, import_typeorm2.Column)()
], Bookmark.prototype, "height", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ nullable: true })
], Bookmark.prototype, "duration", 2);
__decorateClass([
  (0, import_typeorm2.ManyToOne)(() => Author, (author) => author.bookmarks)
], Bookmark.prototype, "author", 2);
Bookmark = __decorateClass([
  (0, import_typeorm2.Entity)()
], Bookmark);

// src/entities/author.entity.ts
var Author = class extends AbstractEntity {
};
__decorateClass([
  (0, import_typeorm3.Column)()
], Author.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm3.Column)()
], Author.prototype, "url", 2);
__decorateClass([
  (0, import_typeorm3.OneToMany)(() => Bookmark, (bookmark) => bookmark.author)
], Author.prototype, "bookmarks", 2);
Author = __decorateClass([
  (0, import_typeorm3.Entity)()
], Author);

// src/exceptions/http.exception.ts
var HttpException = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
};

// src/data-source.ts
var import_config = require("dotenv/config");
var import_reflect_metadata = require("reflect-metadata");
var import_typeorm4 = require("typeorm");
var AppDataSource = new import_typeorm4.DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.NODE_ENV === "test" ? process.env.DB_NAME_TEST : process.env.DB_NAME,
  entities: [__dirname + "/entities/**/*.ts"],
  migrations: [__dirname + "/migrations/**/*.ts"],
  synchronize: false,
  logging: false
});

// src/services/database.service.ts
var DatabaseService = class {
  constructor() {
    this.dataSource = AppDataSource;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseService();
    }
    return this.instance;
  }
  static getManager() {
    return DatabaseService.getInstance().dataSource.manager;
  }
  static async init() {
    return new Promise((resolve, reject) => {
      const instance = DatabaseService.getInstance();
      instance.dataSource.initialize().then(() => {
        if (process.env.NODE_ENV !== "test") {
          console.log("Database initialized");
        }
        resolve();
      }).catch(reject);
    });
  }
};

// src/utils.ts
var import_class_transformer_validator = require("class-transformer-validator");
var Utils = class {
  static dtoFromRequest(classType, req) {
    try {
      return (0, import_class_transformer_validator.transformAndValidateSync)(classType, req.body);
    } catch (error) {
      throw new HttpException(400, JSON.stringify(error));
    }
  }
  static assert(condition, status, message) {
    if (!condition) {
      throw new HttpException(status, message);
    }
  }
};

// src/services/bookmarks.service.ts
var BookmarksService = class {
  constructor() {
    this.manager = DatabaseService.getManager();
  }
  async list(page, limit) {
    const options = { where: { deletedAt: (0, import_typeorm5.IsNull)() } };
    const totalItems = await this.manager.count(Bookmark, options);
    const items = await this.manager.find(Bookmark, options && { skip: (page - 1) * limit, take: limit, order: { createdAt: "DESC" } });
    return {
      items: await Promise.all(items.map(async (item) => await BookmarkDto.fromBookmarkEntity(item))),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }
  async create(dto) {
    const exists = await this.manager.findOne(Bookmark, {
      where: { url: dto.url, deletedAt: (0, import_typeorm5.IsNull)() }
    });
    Utils.assert(!exists, 400, `Bookmark with url ${dto.url} already exists`);
    const oembed = await this._getOembed(dto.url);
    const bookmark = new Bookmark();
    await this._hydrateAndSaveBookmark(bookmark, dto.url, oembed);
    return BookmarkDto.fromBookmarkEntity(bookmark);
  }
  async getBookmark(bookmarkId) {
    const bookmark = await this._fetchBookmarkById(bookmarkId);
    return BookmarkDto.fromBookmarkEntity(bookmark);
  }
  async update(bookmarkId, dto) {
    const exists = await this.manager.findOne(Bookmark, {
      where: { id: (0, import_typeorm5.Not)(bookmarkId), url: dto.url, deletedAt: (0, import_typeorm5.IsNull)() }
    });
    Utils.assert(!exists, 400, `Bookmark with url ${dto.url} already exists`);
    const bookmark = await this._fetchBookmarkById(bookmarkId);
    const oembed = await this._getOembed(dto.url);
    await this._hydrateAndSaveBookmark(bookmark, dto.url, oembed);
    return BookmarkDto.fromBookmarkEntity(bookmark);
  }
  async softRemove(bookmarkId) {
    const bookmark = await this._fetchBookmarkById(bookmarkId);
    bookmark.deletedAt = new Date();
    await this.manager.save(bookmark);
  }
  async _getOembed(url) {
    try {
      const { data } = await import_axios.default.get(this._getOembedUrl(url));
      return data;
    } catch (error) {
      if (import_axios.default.isAxiosError(error)) {
        throw new HttpException(500, `${error.code} - ${error.message}`);
      }
      throw error;
    }
  }
  _getOembedUrl(url) {
    if (new RegExp(/^https:\/\/(www\.)?vimeo.com/, "i").test(url)) {
      return `https://vimeo.com/api/oembed.json?url=${url}`;
    } else if (new RegExp(/^https:\/\/(www\.)?flickr.com\/photos/, "i").test(url)) {
      return `http://www.flickr.com/services/oembed/?format=json&url=${url}`;
    } else {
      throw new HttpException(400, "Invalid bookmark url");
    }
  }
  async _hydrateAndSaveBookmark(bookmark, url, oembed) {
    let author = await this.manager.findOne(Author, {
      where: { name: oembed.author_name, url: oembed.author_url }
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
  async _fetchBookmarkById(id) {
    const bookmark = await this.manager.findOne(Bookmark, { where: { id, deletedAt: (0, import_typeorm5.IsNull)() } });
    if (bookmark === null) {
      throw new HttpException(400, `Bookmark with id ${id} not found!`);
    }
    return bookmark;
  }
};

// src/controllers/bookmarks.controller.ts
var BookmarksController = (0, import_express.Router)();
var bookmarksService = new BookmarksService();
BookmarksController.get("/:page/:limit", (req, res, next) => {
  bookmarksService.list(+req.params.page, +req.params.limit).then((result) => res.status(200).json(result)).catch(next);
});
BookmarksController.get("/:id", async (req, res, next) => {
  bookmarksService.getBookmark(req.params.id).then((result) => res.status(200).json(result)).catch(next);
});
BookmarksController.post("/", (req, res, next) => {
  const dto = Utils.dtoFromRequest(AddEditBookmarkDto, req);
  bookmarksService.create(dto).then((result) => res.status(201).json(result)).catch(next);
});
BookmarksController.put("/:id", (req, res, next) => {
  const dto = Utils.dtoFromRequest(AddEditBookmarkDto, req);
  bookmarksService.update(req.params.id, dto).then((result) => res.status(200).json(result)).catch(next);
});
BookmarksController.delete("/:id", (req, res, next) => {
  bookmarksService.softRemove(req.params.id).then(() => res.sendStatus(204)).catch(next);
});

// src/middlewares/error.middleware.ts
function errorMiddleware(error, _request, response, _next) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message
  });
}

// src/index.ts
var server = new Promise((resolve) => {
  void DatabaseService.init().then(() => {
    const app = (0, import_express2.default)();
    const oauthUser = process.env.OAUTH_USER;
    const oauthPassword = process.env.OAUTH_PASSWORD;
    app.use((0, import_express_basic_auth.default)({ users: { [oauthUser]: oauthPassword } }));
    app.use(import_express2.default.json());
    app.use((0, import_cors.default)());
    app.get("/", function(_req, res) {
      res.send("API is alive");
    });
    app.use("/bookmarks", BookmarksController);
    app.use(errorMiddleware);
    const port = process.env.NODE_ENV === "test" ? process.env.PORT_TEST : process.env.PORT;
    app.listen(port, () => {
      if (process.env.NODE_ENV !== "test") {
        console.log(`API is running on port ${port}`);
      }
    });
    resolve(app);
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  server
});
