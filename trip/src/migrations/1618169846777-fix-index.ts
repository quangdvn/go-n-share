import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixIndex1618169846777 implements MigrationInterface {
  name = 'fixIndex1618169846777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_f34eea107e133d84110a32be40` ON `trips`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_7f1d403aa05a4e42f9659dd3b7` ON `trips` (`departureDate`, `departureTime`, `arriveDate`, `arriveTime`, `coachId`, `driverId`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_7f1d403aa05a4e42f9659dd3b7` ON `trips`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_f34eea107e133d84110a32be40` ON `trips` (`departureDate`, `departureTime`, `arriveDate`, `arriveTime`, `coachId`)',
    );
  }
}
