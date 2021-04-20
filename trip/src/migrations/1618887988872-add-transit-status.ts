import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransitStatus1618887988872 implements MigrationInterface {
  name = 'addTransitStatus1618887988872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_ac64802832d4c12b3904255349` ON `transits`',
    );
    await queryRunner.query(
      "ALTER TABLE `transitDetails` ADD `transitStatus` enum ('ready', 'waiting', 'picked', 'cancelled') NOT NULL DEFAULT 'ready'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transitDetails` DROP COLUMN `transitStatus`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_ac64802832d4c12b3904255349` ON `transits` (`tripId`)',
    );
  }
}
