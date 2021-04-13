import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1618079137924 implements MigrationInterface {
  name = 'init1618079137924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `trips` (`id` int NOT NULL AUTO_INCREMENT, `departureDate` varchar(255) NOT NULL, `departureTime` enum ('7', '14', '20') NOT NULL, `arriveDate` varchar(255) NOT NULL, `arriveTime` int NOT NULL, `coachId` int NOT NULL, `driverId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `trips`');
  }
}
