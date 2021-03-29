import { MigrationInterface, QueryRunner } from 'typeorm';

export class first1616354060758 implements MigrationInterface {
  name = 'first1616354060758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `staffs` (`id` int NOT NULL, `username` varchar(255) NOT NULL, `fullname` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `role` enum ('supervising', 'scheduling', 'tracking') NOT NULL DEFAULT 'supervising', `workingStatus` enum ('working', 'resign') NOT NULL DEFAULT 'working', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_f1a91efeee4f296a21963a9073` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_f1a91efeee4f296a21963a9073` ON `staffs`',
    );
    await queryRunner.query('DROP TABLE `staffs`');
  }
}
