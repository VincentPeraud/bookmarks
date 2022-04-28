import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import { BookmarksController } from '~/controllers/bookmarks.controller';
import { errorMiddleware } from '~/middlewares/error.middleware';
import { DatabaseService } from '~/services/database.service';

export const server = new Promise((resolve) => {
  void DatabaseService.init().then(() => {
    const app = express();

    const oauthUser = process.env.OAUTH_USER;
    const oauthPassword = process.env.OAUTH_PASSWORD;
    app.use(expressBasicAuth({ users: { [oauthUser]: oauthPassword } }));

    app.use(express.json());
    app.use(cors());

    app.get('/', function (_req, res) {
      res.send('API is alive');
    });
    app.use('/bookmarks', BookmarksController);

    app.use(errorMiddleware);

    const port = process.env.NODE_ENV === 'test' ? process.env.PORT_TEST : process.env.PORT;

    app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line no-console
        console.log(`API is running on port ${port}`);
      }
    });

    resolve(app);
  });
});
