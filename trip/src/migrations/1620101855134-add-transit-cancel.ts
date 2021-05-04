import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransitCancel1620101855134 implements MigrationInterface {
  name = 'addTransitCancel1620101855134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_ac64802832d4c12b3904255349` ON `transits`',
    );
    await queryRunner.query(
      'ALTER TABLE `transitDetails` ADD `isCancel` tinyint NOT NULL DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transitDetails` DROP COLUMN `isCancel`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_ac64802832d4c12b3904255349` ON `transits` (`tripId`)',
    );
  }
}
