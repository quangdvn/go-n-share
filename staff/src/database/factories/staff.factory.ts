import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Staff } from '../../staff/staff.entity';

define(Staff, (faker: typeof Faker) => {
  const staff = new Staff();
  return staff;
});
