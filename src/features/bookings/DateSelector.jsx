import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "../../context/ReservationContext";
import { useEffect } from "react";

const isAlreadyBooked = (range, datesArr) => {
  if (!range?.from || !range?.to) return false;

  return datesArr.some((date) =>
    isWithinInterval(date, {
      start: range.from,
      end: range.to,
    })
  );
};

function DateSelector({ settings, cabin, bookedDates, setValue }) {
  const { range, setRange, resetRange } = useReservation();

  const bookedDateObjects = bookedDates.map(
    (date) => new Date(date)
  );

  const displayRange = range;

  const { regularPrice = 0, discount = 0 } = cabin || {};

  const numNights =
    displayRange?.from && displayRange?.to
      ? Math.max(
          1,
          differenceInDays(displayRange.to, displayRange.from)
        )
      : 0;

  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings || {};

  // ✅ Sync to react-hook-form safely
  useEffect(() => {
    if (range?.from && range?.to) {
      setValue("startDate", range.from.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("endDate", range.to.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("startDate", undefined);
      setValue("endDate", undefined);
    }
  }, [range, setValue]);

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="place-self-center pt-12"
        mode="range"
        selected={displayRange}
        onSelect={(selectedRange) => {
          // ✅ prevent weird partial/null crashes
          if (!selectedRange?.from) {
            setRange(null);
            return;
          }
          setRange(selectedRange);
        }}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDateObjects.some((date) =>
            isSameDay(date, curDate)
          )
        }
      />

      {/* PRICE DISPLAY */}
      <div className="flex h-18 items-center justify-between bg-accent-500 px-8 text-primary-800">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount > 0 ? (
              <>
                <span className="text-2xl">
                  {regularPrice - discount}
                </span>

                <span className="font-semibold line-through text-primary-700">
                  {regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">{regularPrice}</span>
            )}

            <span>/night</span>
          </p>

          {numNights > 0 && (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>

              <p>
                <span className="text-lg font-bold uppercase">
                  Total
                </span>{" "}
                <span className="text-2xl font-semibold">
                  ${cabinPrice}
                </span>
              </p>
            </>
          )}
        </div>

        {/* CLEAR BUTTON */}
        {(range?.from || range?.to) && (
          <button
            type="button"
            className="border border-primary-800 px-4 py-2 text-sm font-semibold"
            onClick={() => {
              resetRange();
              setValue("startDate", undefined);
              setValue("endDate", undefined);
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;