import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTrip1618080952244 implements MigrationInterface {
  name = 'fixTrip1618080952244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `trips` ADD `tripStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `trips` DROP COLUMN `tripStatus`');
  }
}
