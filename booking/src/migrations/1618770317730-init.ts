import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1618770317730 implements MigrationInterface {
  name = 'init1618770317730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `bookings` (`id` int NOT NULL AUTO_INCREMENT, `bookingName` varchar(255) NOT NULL, `bookingMail` varchar(255) NOT NULL, `bookingPhone` varchar(255) NOT NULL, `totalPrice` int NOT NULL, `isVerify` tinyint NOT NULL DEFAULT 0, `hasTransit` tinyint NOT NULL DEFAULT 0, `transitDetailId` int NULL, `notes` text NULL, `tripId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `bookings`');
  }
}
