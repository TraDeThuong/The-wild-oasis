import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { useCabins } from "../cabins/useCabins";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import DateSelector from "./DateSelector";
import { useSettings } from "../settings/useSettings";
import { useReservation } from "../../context/ReservationContext";
import { getBookedDatesByCabinId } from "../../services/apiBookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { createBookingWithGuest } from "../../services/apiBookings";
import * as countriesLib from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

// register country locale
countriesLib.registerLocale(en);

// build country list with flags
const countryList = Object.entries(
  countriesLib.getNames("en", { select: "official" })
).map(([code, name]) => ({
  code,
  name,
  flag: getFlagEmoji(code),
}));

function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

export default function CreateBookingForm() {
  const { isCabinsLoading, cabins = [] } = useCabins();
  const { settings, isLoading: isSettingLoading } = useSettings();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { resetRange } = useReservation();

  const selectedCabinId = useWatch({
    control,
    name: "cabinID",
  });

  const selectedCabin = cabins.find(
    (cabin) => String(cabin.id) === String(selectedCabinId)
  );

  const maxCapacity = selectedCabin?.maxCapacity ?? 0;

  const [bookedDates, setBookedDates] = useState([]);

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: createBookingWithGuest,
    onSuccess: () => {
      toast.success("New booking + Guest successfully created");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      reset();
      resetRange();
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!selectedCabinId) return;

    async function fetchBookedDates() {
      const dates = await getBookedDatesByCabinId(selectedCabinId);
      setBookedDates(dates);
    }

    fetchBookedDates();
  }, [selectedCabinId]);

  if (isCabinsLoading || isSettingLoading || isCreating) return <Spinner />;

  const bookedDatesISO = bookedDates.map((d) =>
    new Date(d).toISOString()
  );

  function handleReset() {
    reset();
    resetRange();
  }

  function onSubmit(data) {
    mutate(data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <div>
      <h1>Booking</h1>
      <p>Used when a customer books a room directly at the reception desk.</p>

      <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={handleReset}>
        {/* Guest Name */}
        <FormRow label="Guest Name" error={errors?.fullName?.message}>
          <Input
            id="fullName"
            {...register("fullName", {
              required: "Guest name is required",
            })}
          />
        </FormRow>

        {/* Email */}
        <FormRow label="Guest Email" error={errors?.email?.message}>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Guest email is required",
            })}
          />
        </FormRow>

        {/* Country with flag */}
        <FormRow
          label="Country"
          htmlFor="nationality"
          error={errors?.nationality?.message}
        >
          <select
            id="nationality"
            {...register("nationality", {
              required: "Country is required",
            })}
            defaultValue=""
          >
            <option value="">Select a country...</option>

            {countryList.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </FormRow>

        {/* Cabin */}
        <FormRow label="Cabin name" error={errors?.cabinID?.message}>
          <select
            id="cabinID"
            {...register("cabinID", {
              required: "Cabin is required",
            })}
          >
            <option value="">Select Cabin</option>
            {cabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Status" error={errors?.status?.message}>
          <select
            id="status"
            {...register("status", {
              required: "Status is required",
            })}
            defaultValue="unconfirmed"
          >
            <option value="unconfirmed">Unconfirmed</option>
            <option value="checked-in">Checked in</option>
            <option value="checked-out">Checked out</option>
          </select>
        </FormRow>

        <input
          type="hidden"
          {...register("startDate", {
            required: "Booking dates are required",
          })}
        />
        <input
          type="hidden"
          {...register("endDate", {
            required: "Booking dates are required",
          })}
        />

        {/* Date selector */}
        {selectedCabin && (
          <FormRow
            label="Booking dates"
            error={
              errors?.startDate?.message || errors?.endDate?.message
            }
          >
            <DateSelector
              settings={settings}
              cabin={selectedCabin}
              bookedDates={bookedDatesISO}
              setValue={setValue}
            />
          </FormRow>
        )}

        {/* Guests */}
        <FormRow
          label="Number of guests"
          error={errors?.numGuests?.message}
        >
          <select
            id="numGuests"
            disabled={!selectedCabinId}
            {...register("numGuests", {
              required: "Number of guests is required",
            })}
          >
            <option value="">Select number of guests...</option>

            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              )
            )}
          </select>
        </FormRow>

        {/* Notes */}
        <FormRow label="Special requests or notes">
          <textarea
            rows={5}
            placeholder="Let us know anything important about the guest's stay..."
            {...register("observations")}
          />
        </FormRow>

        {/* Actions */}
        <FormRow>
          <Button type="reset" variation="secondary">
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            Add Booking
          </Button>
        </FormRow>
      </Form>
    </div>
  );
}