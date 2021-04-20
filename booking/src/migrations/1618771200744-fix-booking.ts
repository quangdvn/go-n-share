import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixBooking1618771200744 implements MigrationInterface {
  name = 'fixBooking1618771200744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bookings` ADD `bookingStatus` enum ('pending', 'success', 'cancelled') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `bookings` ADD `paymentMethod` enum ('cash', 'online') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `bookings` DROP COLUMN `paymentMethod`',
    );
    await queryRunner.query(
      'ALTER TABLE `bookings` DROP COLUMN `bookingStatus`',
    );
  }
}
