import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIndex1618169738361 implements MigrationInterface {
  name = 'addIndex1618169738361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_f34eea107e133d84110a32be40` ON `trips` (`departureDate`, `departureTime`, `arriveDate`, `arriveTime`, `coachId`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_f34eea107e133d84110a32be40` ON `trips`',
    );
  }
}
