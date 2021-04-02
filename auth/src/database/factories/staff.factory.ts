import { define } from 'typeorm-seeding';
import { Staff } from '../../staff/staff.entity';

define(Staff, () => {
  const staff = new Staff();
  staff.password = '123456';
  return staff;
});
