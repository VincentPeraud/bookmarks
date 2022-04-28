import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1651146675707 implements MigrationInterface {
  name = 'Migration1651146675707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bookmark\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`publishedAt\` datetime NULL, \`thumbnailUrl\` text NOT NULL, \`width\` int NOT NULL, \`height\` int NOT NULL, \`duration\` int NULL, \`authorId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`author\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookmark\` ADD CONSTRAINT \`FK_905124dbd8b001ba56fc121eb2a\` FOREIGN KEY (\`authorId\`) REFERENCES \`author\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_905124dbd8b001ba56fc121eb2a\``,
    );
    await queryRunner.query(`DROP TABLE \`author\``);
    await queryRunner.query(`DROP TABLE \`bookmark\``);
  }
}
