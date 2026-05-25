import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { differenceInDays, eachDayOfInterval } from "date-fns";
import { createGuest } from "./apiGuests";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("Bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, Cabins(name), Guests(fullName, email)",
      { count: "exact" },
    );

  // FILTER
  if (filter) query = query.eq(filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  //PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("Bookings")
    .select("*, Cabins(*), Guests(*)")
    .eq("id", id)
    .single(); // Ensures the query returns a single object instead of an array of objects

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISO string
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("Bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("Bookings")
    // .select('*')
    .select("*, Guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("Bookings")
    .select("*, Guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("Bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("Bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("Bookings")
    .insert([newBooking])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data?.[0];
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("Bookings")
    .select("*")
    .eq("cabinID", cabinId)
    .or(`startDate.gte.${today},status.eq."checked-in"`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

function getFlagUrl(countryCode) {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export async function createBookingWithGuest(data) {
  // 1. Create guest
  const guest = await createGuest({
    fullName: data.fullName,
    email: data.email,
    nationality: data.nationality,
    nationalID: data.nationalID,
    countryFlag: getFlagUrl(data.nationality),
    created_at: new Date().toISOString(),
  });

  // 2. GET CABIN DATA (🔥 IMPORTANT FIX)
  const { data: cabin, error } = await supabase
    .from("Cabins")
    .select("regularPrice, discount")
    .eq("id", data.cabinID)
    .single();

  if (error) throw new Error("Cabin not found");

  // 3. Calculate nights
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const numNights = differenceInDays(endDate, startDate);

  if (!data.startDate || !data.endDate || isNaN(numNights) || numNights <= 0) {
    throw new Error("Booking dates are invalid");
  }

  // 4. REAL price calculation
  const cabinPrice =
    numNights * ((cabin.regularPrice ?? 0) - (cabin.discount ?? 0));

  // 5. Create booking
  const booking = await createBooking({
    cabinID: Number(data.cabinID),
    guestID: guest.id,

    status: data.status ?? "unconfirmed",

    startDate: data.startDate,
    endDate: data.endDate,

    numGuests: Number(data.numGuests),

    numNights,
    totalPrice: cabinPrice,
  });

  return booking;
}
