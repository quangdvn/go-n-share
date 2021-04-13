import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTrip1618126677127 implements MigrationInterface {
  name = 'addTrip1618126677127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `trips` (`id` int NOT NULL, `departureDate` varchar(255) NOT NULL, `departureTime` enum ('7', '14', '20') NOT NULL, `arriveDate` varchar(255) NOT NULL, `arriveTime` int NOT NULL, `tripStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm', `coachId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `trips` ADD CONSTRAINT `FK_06cf1e7c4f8717f9da09ecdeb2c` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `trips` DROP FOREIGN KEY `FK_06cf1e7c4f8717f9da09ecdeb2c`',
    );
    await queryRunner.query('DROP TABLE `trips`');
  }
}
