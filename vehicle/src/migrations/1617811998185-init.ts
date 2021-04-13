import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1617811998185 implements MigrationInterface {
  name = 'init1617811998185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `coachTypes` (`id` int NOT NULL AUTO_INCREMENT, `seatNumber` int NOT NULL, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_a5e8de887282d77be42ed4e180` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `coaches` (`id` int NOT NULL AUTO_INCREMENT, `numberPlate` varchar(255) NOT NULL, `isAvailable` tinyint NOT NULL DEFAULT 1, `typeId` int NOT NULL, `locationId` int NOT NULL, `routeId` int NOT NULL, UNIQUE INDEX `IDX_38e29292952c5d6769c0ebded0` (`numberPlate`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `routes` (`id` int NOT NULL AUTO_INCREMENT, `drivingDuration` int NOT NULL, `basePrice` int NOT NULL, `departureId` int NOT NULL, `arriveId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `terminals` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `address` varchar(255) NOT NULL, `latitude` varchar(255) NOT NULL, `longitude` varchar(255) NOT NULL, `locationId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `locations` (`id` int NOT NULL AUTO_INCREMENT, `name` enum ('HAN', 'HCM', 'DAN', 'QAN', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh') NOT NULL, `subname` enum ('HAN', 'HCM', 'DAN', 'QAN', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh') NOT NULL, UNIQUE INDEX `IDX_227023051ab1fedef7a3b6c7e2` (`name`), UNIQUE INDEX `IDX_e6a422fa04ae7059d2dcd12152` (`subname`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `cabs` (`id` int NOT NULL AUTO_INCREMENT, `numberPlate` varchar(255) NOT NULL, `isAvailable` tinyint NOT NULL DEFAULT 1, `typeId` int NOT NULL, `locationId` int NOT NULL, UNIQUE INDEX `IDX_cc7ee6a510bb98f2335d842a1c` (`numberPlate`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `cabTypes` (`id` int NOT NULL AUTO_INCREMENT, `seatNumber` int NOT NULL, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_de4d43a4dbbe38cbf8599ad824` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` ADD CONSTRAINT `FK_269504cb0bc06190f7e3905973a` FOREIGN KEY (`typeId`) REFERENCES `coachTypes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` ADD CONSTRAINT `FK_824db033a9b49d50a619873a064` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` ADD CONSTRAINT `FK_78a426c9e57aa5d58d2e2a332aa` FOREIGN KEY (`routeId`) REFERENCES `routes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `routes` ADD CONSTRAINT `FK_cc53a0819ba8388b53f966ec948` FOREIGN KEY (`departureId`) REFERENCES `terminals`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `routes` ADD CONSTRAINT `FK_644262cc0b5e66e3c0f0d718655` FOREIGN KEY (`arriveId`) REFERENCES `terminals`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `terminals` ADD CONSTRAINT `FK_06c614ce00c592bebed72f0547a` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `cabs` ADD CONSTRAINT `FK_2d646341506bc7ce889c82b45d6` FOREIGN KEY (`typeId`) REFERENCES `cabTypes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `cabs` ADD CONSTRAINT `FK_3e48b3bc5d0ccfaf5d909f138d8` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `cabs` DROP FOREIGN KEY `FK_3e48b3bc5d0ccfaf5d909f138d8`',
    );
    await queryRunner.query(
      'ALTER TABLE `cabs` DROP FOREIGN KEY `FK_2d646341506bc7ce889c82b45d6`',
    );
    await queryRunner.query(
      'ALTER TABLE `terminals` DROP FOREIGN KEY `FK_06c614ce00c592bebed72f0547a`',
    );
    await queryRunner.query(
      'ALTER TABLE `routes` DROP FOREIGN KEY `FK_644262cc0b5e66e3c0f0d718655`',
    );
    await queryRunner.query(
      'ALTER TABLE `routes` DROP FOREIGN KEY `FK_cc53a0819ba8388b53f966ec948`',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` DROP FOREIGN KEY `FK_78a426c9e57aa5d58d2e2a332aa`',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` DROP FOREIGN KEY `FK_824db033a9b49d50a619873a064`',
    );
    await queryRunner.query(
      'ALTER TABLE `coaches` DROP FOREIGN KEY `FK_269504cb0bc06190f7e3905973a`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_de4d43a4dbbe38cbf8599ad824` ON `cabTypes`',
    );
    await queryRunner.query('DROP TABLE `cabTypes`');
    await queryRunner.query(
      'DROP INDEX `IDX_cc7ee6a510bb98f2335d842a1c` ON `cabs`',
    );
    await queryRunner.query('DROP TABLE `cabs`');
    await queryRunner.query(
      'DROP INDEX `IDX_e6a422fa04ae7059d2dcd12152` ON `locations`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_227023051ab1fedef7a3b6c7e2` ON `locations`',
    );
    await queryRunner.query('DROP TABLE `locations`');
    await queryRunner.query('DROP TABLE `terminals`');
    await queryRunner.query('DROP TABLE `routes`');
    await queryRunner.query(
      'DROP INDEX `IDX_38e29292952c5d6769c0ebded0` ON `coaches`',
    );
    await queryRunner.query('DROP TABLE `coaches`');
    await queryRunner.query(
      'DROP INDEX `IDX_a5e8de887282d77be42ed4e180` ON `coachTypes`',
    );
    await queryRunner.query('DROP TABLE `coachTypes`');
  }
}
