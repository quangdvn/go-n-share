import { StaffRoles } from '@quangdvnnnn/go-n-share';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Staff } from '../../staff/staff.entity';

export default class CreateStaff implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Staff)
    //   .values([
    //     {
    //       username: 'admin1',
    //       password: '123456',
    //       role: StaffRoles.SUPERVISING,
    //     },
    //     {
    //       username: 'admin2',
    //       password: '123456',
    //       role: StaffRoles.SUPERVISING,
    //     },
    //   ])
    //   .execute();
    await factory(Staff)().create({
      username: 'admin1',
      role: StaffRoles.SUPERVISING,
    });
    await factory(Staff)().create({
      username: 'admin2',
      role: StaffRoles.SUPERVISING,
    });
    // await factory(Staff)().create({
    //   username: 'staff1',
    //   role: StaffRoles.SCHEDULING,
    // });
    // await factory(Staff)().create({
    //   username: 'staff2',
    //   role: StaffRoles.SCHEDULING,
    // });
    // await factory(Staff)().create({
    //   username: 'staff3',
    //   role: StaffRoles.TRACKING,
    // });
    // await factory(Staff)().create({
    //   username: 'staff4',
    //   role: StaffRoles.TRACKING,
    // });
  }
}
