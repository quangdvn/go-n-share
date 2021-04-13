import { define } from 'typeorm-seeding';
import { Coach } from '../../coach/coach.entity';
import { genRand } from '../../utils';

define(Coach, () => {
  const numbers = [29, 14, 43, 41];
  const letters = ['A', 'B'];

  const locationId = genRand(4, 1);
  const typeId = genRand(3, 1);

  const coach = new Coach();

  const numberPlate = `${numbers[locationId - 1]}${
    letters[genRand(2, 1) - 1]
  }-${genRand(99999, 10000)}`;

  coach.isAvailable = true;
  coach.locationId = locationId;
  coach.numberPlate = numberPlate;
  coach.typeId = typeId;

  return coach;
});
