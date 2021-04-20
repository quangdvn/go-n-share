import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTransit1618518146222 implements MigrationInterface {
  name = 'fixTransit1618518146222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `transits` DROP COLUMN `createdAt`');
    await queryRunner.query('ALTER TABLE `transits` DROP COLUMN `updatedAt`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transits` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `transits` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
  }
}
