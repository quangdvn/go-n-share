import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransit1618518017897 implements MigrationInterface {
  name = 'addTransit1618518017897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `transits` (`id` int NOT NULL, `departureDate` varchar(255) NOT NULL, `departureShift` enum ('7', '14', '20') NOT NULL, `transitStatus` enum ('unconfirm', 'ready', 'going', 'finished') NOT NULL DEFAULT 'unconfirm', `cabId` int NOT NULL, `tripId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `transits` ADD CONSTRAINT `FK_808d55c77ada75c2142315294eb` FOREIGN KEY (`cabId`) REFERENCES `cabs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `transits` DROP FOREIGN KEY `FK_808d55c77ada75c2142315294eb`',
    );
    await queryRunner.query('DROP TABLE `transits`');
  }
}
