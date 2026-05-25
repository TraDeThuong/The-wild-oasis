import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getGuest(email) {
  const { data, error } = await supabase
    .from("Guests")
    .select("*")
    .eq("email", email)
    .single();

    if (error) {
        console.error (error);
        throw new Error ("Guest could not be loaded");
    }
  return data;
}

export async function getGuests ({filter, sortBy, page}) {
   let query = supabase
    .from ("Guests")
    .select("id, created_at, fullName, email, nationalID, nationality, countryFlag", 
      {count: "exact"}
    );

    // FILTER 
    if (filter) query = query.eq(filter.field, filter.value)

    // SORT
    const fieldMap = {
        startDate: "created_at",
    };

    const sortField = fieldMap[sortBy?.field] || sortBy?.field;

    if (sortBy)
        query = query.order(sortField, {
        ascending: sortBy.direction === "asc",
        });

    //PAGINATION
    if (page) {
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)
    }

   const {data, error, count} = await query

  if (error) {
    console.error (error);
    throw new Error ("Guests could not be loaded");
  }

  return {data, count}
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("Guests")
    .insert([newGuest])
    .select() 
  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data?.[0]; // ✅ return single guest object
}

