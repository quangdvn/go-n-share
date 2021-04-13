import { define } from 'typeorm-seeding';
import { Cab } from '../../cab/cab.entity';

import { genRand } from '../../utils';

define(Cab, () => {
  const numbers = [29, 14, 43, 41];
  const letters = ['A', 'B'];

  const locationId = genRand(3, 1);
  const typeId = genRand(3, 1);

  const cab = new Cab();

  const numberPlate = `${numbers[locationId - 1]}${
    letters[genRand(2, 1) - 1]
  }-${genRand(99999, 10000)}`;

  cab.locationId = locationId;
  cab.numberPlate = numberPlate;
  cab.typeId = typeId;

  return cab;
});
