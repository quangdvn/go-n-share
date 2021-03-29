import {MigrationInterface, QueryRunner} from "typeorm";

export class addPhoneToDriver1616732199204 implements MigrationInterface {
    name = 'addPhoneToDriver1616732199204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `drivers` ADD `phone` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `drivers` ADD UNIQUE INDEX `IDX_b97a5a68c766d2d1ec25e6a85b` (`phone`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `drivers` DROP INDEX `IDX_b97a5a68c766d2d1ec25e6a85b`");
        await queryRunner.query("ALTER TABLE `drivers` DROP COLUMN `phone`");
    }

}
