import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTrip1618412274126 implements MigrationInterface {
  name = 'fixTrip1618412274126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `trips` ADD `departureLocation` enum ('HAN', 'HCM', 'DAN', 'QAN', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `trips` ADD `arriveLocation` enum ('HAN', 'HCM', 'DAN', 'QAN', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `trips` DROP COLUMN `arriveLocation`');
    await queryRunner.query(
      'ALTER TABLE `trips` DROP COLUMN `departureLocation`',
    );
  }
}
