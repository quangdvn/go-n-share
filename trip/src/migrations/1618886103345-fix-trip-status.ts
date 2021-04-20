import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTripStatus1618886103345 implements MigrationInterface {
  name = 'fixTripStatus1618886103345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_ac64802832d4c12b3904255349` ON `transits`',
    );
    await queryRunner.query(
      "CREATE TABLE `transitDetails` (`id` int NOT NULL AUTO_INCREMENT, `bookingName` varchar(255) NOT NULL, `bookingPhone` varchar(255) NOT NULL, `bookingStatus` enum ('pending', 'success', 'cancelled') NOT NULL, `notes` text NULL, `address` text NOT NULL, `latitude` varchar(255) NOT NULL, `longitude` varchar(255) NOT NULL, `transitId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `trips` CHANGE `tripStatus` `tripStatus` enum ('unconfirm', 'ready', 'full', 'going', 'finished') NOT NULL DEFAULT 'unconfirm'",
    );
    await queryRunner.query(
      "ALTER TABLE `transits` CHANGE `transitStatus` `transitStatus` enum ('unconfirm', 'ready', 'full', 'going', 'finished') NOT NULL DEFAULT 'unconfirm'",
    );
    await queryRunner.query(
      'ALTER TABLE `transitDetails` ADD CONSTRAINT `FK_ccbaaed73a29b52496083a7a421` FOREIGN KEY (`transitId`) REFERENCES `transits`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transitDetails` DROP FOREIGN KEY `FK_ccbaaed73a29b52496083a7a421`',
    );
    await queryRunner.query(
      "ALTER TABLE `transits` CHANGE `transitStatus` `transitStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm'",
    );
    await queryRunner.query(
      "ALTER TABLE `trips` CHANGE `tripStatus` `tripStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm'",
    );
    await queryRunner.query('DROP TABLE `transitDetails`');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_ac64802832d4c12b3904255349` ON `transits` (`tripId`)',
    );
  }
}
