import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixSmt1618887034217 implements MigrationInterface {
  name = 'fixSmt1618887034217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transits` DROP FOREIGN KEY `FK_ac64802832d4c12b39042553498`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_0b744efdafa308cf0975b49b4a` ON `transits`',
    );
    await queryRunner.query(
      'ALTER TABLE `transits` ADD UNIQUE INDEX `IDX_ac64802832d4c12b3904255349` (`tripId`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_0b744efdafa308cf0975b49b4a` ON `transits` (`departureDate`, `departureShift`, `cabId`, `driverId`, `tripId`)',
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
      'DROP INDEX `IDX_0b744efdafa308cf0975b49b4a` ON `transits`',
    );
    await queryRunner.query(
      'ALTER TABLE `transits` DROP INDEX `IDX_ac64802832d4c12b3904255349`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_0b744efdafa308cf0975b49b4a` ON `transits` (`departureDate`, `departureShift`, `cabId`, `driverId`, `tripId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `transits` ADD CONSTRAINT `FK_ac64802832d4c12b39042553498` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
