import {MigrationInterface, QueryRunner} from "typeorm";

export class init1616527510898 implements MigrationInterface {
    name = 'init1616527510898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `drivers` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` varchar(255) NOT NULL, `workingStatus` varchar(255) NOT NULL DEFAULT 'working', UNIQUE INDEX `IDX_12b7ae6be889f41a28bec59184` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `staffs` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` varchar(255) NOT NULL DEFAULT 'supervising', `workingStatus` varchar(255) NOT NULL DEFAULT 'working', UNIQUE INDEX `IDX_f1a91efeee4f296a21963a9073` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_f1a91efeee4f296a21963a9073` ON `staffs`");
        await queryRunner.query("DROP TABLE `staffs`");
        await queryRunner.query("DROP INDEX `IDX_12b7ae6be889f41a28bec59184` ON `drivers`");
        await queryRunner.query("DROP TABLE `drivers`");
    }

}
