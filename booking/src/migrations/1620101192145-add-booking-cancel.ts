import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBookingCancel1620101192145 implements MigrationInterface {
  name = 'addBookingCancel1620101192145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `bookings` ADD `isCancel` tinyint NOT NULL DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bookings` DROP COLUMN `isCancel`');
  }
}
