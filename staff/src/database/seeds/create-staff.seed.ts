import { StaffRoles } from '@quangdvnnnn/go-n-share';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Staff } from '../../staff/staff.entity';

export default class CreateStaff implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Staff)
      .values([
        {
          id: 1,
          username: 'admin1',
          fullname: 'Nguyễn Văn A',
          role: StaffRoles.SUPERVISING,
          phone: '0977860498',
        },
        {
          id: 2,
          username: 'admin2',
          fullname: 'Nguyễn Văn B',
          role: StaffRoles.SUPERVISING,
          phone: '0977860499',
        },
      ])
      .execute();
    // await factory(Staff)().create({
    //   id: 1,
    //   username: 'admin1',
    //   fullname: 'Nguyễn Văn A',
    //   phone: '0977860498',
    // });

    // await factory(Staff)().create({
    //   id: 2,
    //   username: 'admin2',
    //   fullname: 'Nguyễn Văn B',
    //   phone: '0977860499',
    // });
  }
}
