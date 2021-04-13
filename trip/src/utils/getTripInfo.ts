import { TripShift } from '@quangdvnnnn/go-n-share';
import dayjs from 'dayjs';
import { getShift } from './getShift';
import { revertLocaleDate } from './revertLocaleDate';

interface TripData {
  departureDate: string;
  departureTime: number;
  tripDuration: number;
}

const DAY_HOURS = 24;

export function getTripInfo(tripData: TripData) {
  const shifts = [TripShift.MORNING, TripShift.AFTERNOON, TripShift.NIGHT];

  const firstTotal = tripData.departureTime + tripData.tripDuration;

  const nextShift = firstTotal % DAY_HOURS;

  const endFirstDiff = Math.floor(firstTotal / 24);

  const firtTripDate = dayjs(tripData.departureDate, 'YYYY-MM-DD').toDate();

  const endFirstTripDate = dayjs(tripData.departureDate, 'YYYY-MM-DD')
    .add(endFirstDiff, 'days')
    .toDate();

  // ============================= //
  const secondTripDepartureTime = getShift(shifts, nextShift);

  const nextDayDiff = secondTripDepartureTime.next
    ? endFirstDiff + 1
    : endFirstDiff;

  const secondStart = secondTripDepartureTime.shift;

  const secondTotal = secondStart + tripData.tripDuration;

  const secondNextShift = secondTotal % 24;

  const endSecondDiff = Math.floor(secondTotal / 24);

  const secondStartDay = dayjs(tripData.departureDate, 'YYYY-MM-DD') //* Lấy ngày khởi hành 2
    .add(nextDayDiff, 'days')
    .toDate();

  const secondEndDay = dayjs(secondStartDay, 'YYYY-MM-DD') //* Lấy ngày khởi hành 2
    .add(endSecondDiff, 'days')
    .toDate();

  // ================================= //

  const startFirtTripDateString = revertLocaleDate(
    firtTripDate.toLocaleDateString(),
  );
  const endFirstTripDateString = revertLocaleDate(
    endFirstTripDate.toLocaleDateString(),
  );
  const startSecondTripString = revertLocaleDate(
    secondStartDay.toLocaleDateString(),
  );
  const endSecondTripString = revertLocaleDate(
    secondEndDay.toLocaleDateString(),
  );

  return {
    firstDepartureDate: startFirtTripDateString,
    firstDepartureTime: tripData.departureTime,
    firstArriveDate: endFirstTripDateString,
    firstArriveTime: nextShift,
    secondDepartureDate: startSecondTripString,
    secondDepartureTime: secondStart,
    secondArriveDate: endSecondTripString,
    secondArriveTime: secondNextShift,
  };
}
