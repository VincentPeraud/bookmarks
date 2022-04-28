import { DataSource, EntityManager } from 'typeorm';
import { AppDataSource } from '../data-source';

export class DatabaseService {
  private static instance: DatabaseService;
  private dataSource: DataSource;

  private constructor() {
    this.dataSource = AppDataSource;
  }

  static getInstance(): DatabaseService {
    if (!this.instance) {
      this.instance = new DatabaseService();
    }

    return this.instance;
  }

  static getManager(): EntityManager {
    return DatabaseService.getInstance().dataSource.manager;
  }

  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const instance = DatabaseService.getInstance();
      instance.dataSource
        .initialize()
        .then(() => {
          if (process.env.NODE_ENV !== 'test') {
            // eslint-disable-next-line no-console
            console.log('Database initialized');
          }
          resolve();
        })
        .catch(reject);
    });
  }
}
