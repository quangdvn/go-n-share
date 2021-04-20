import { MigrationInterface, QueryRunner } from 'typeorm';

export class genTransit1618516610762 implements MigrationInterface {
  name = 'genTransit1618516610762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `transits` (`id` int NOT NULL AUTO_INCREMENT, `departureDate` varchar(255) NOT NULL, `departureShift` enum ('7', '14', '20') NOT NULL, `transitStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm', `cabId` int NOT NULL, `driverId` int NOT NULL, `tripId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_0b744efdafa308cf0975b49b4a` (`departureDate`, `departureShift`, `cabId`, `driverId`, `tripId`), UNIQUE INDEX `REL_ac64802832d4c12b3904255349` (`tripId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `transits` ADD CONSTRAINT `FK_ac64802832d4c12b39042553498` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transits` DROP FOREIGN KEY `FK_ac64802832d4c12b39042553498`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_ac64802832d4c12b3904255349` ON `transits`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_0b744efdafa308cf0975b49b4a` ON `transits`',
    );
    await queryRunner.query('DROP TABLE `transits`');
  }
}
