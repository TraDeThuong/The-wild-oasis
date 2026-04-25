import supabase, {supabaseUrl} from "./supabase"

export async function getCabins() {
    
    const { data, error } = await supabase
    .from('Cabins')
    .select('*')

    if (error) {
        console.error (error);
        throw new Error ("Cabins could not be loaded")
    }
    return data
}

// Ham nay su dung cho Create-Cabin-Form-v1
export async function createCabin(newCabin) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

    // 1. Upload image trước
    const { error: storageError } = await supabase.storage
        .from("cabins-image")
        .upload(imageName, newCabin.image);

    if (storageError) {
        console.error(storageError);
        throw new Error("Cabin image could not be uploaded");
    }

    // 2. Tạo URL ảnh
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabins-image/${imageName}`;

    // 3. Insert cabin với field image 
    const { data, error } = await supabase
        .from("Cabins")
        .insert([{ ...newCabin, image: imagePath }])
        .select();

    if (error) {
        console.error(error);
        throw new Error("Cabin could not be created");
    }

    return data;
}

// Ham nay su dung cho Create-Cabin-Form
export async function createEditCabin(newCabin, id) {

    // If true → keep old image, If false → upload new image
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    const imagePath = hasImagePath
        ? newCabin.image
        :`${supabaseUrl}/storage/v1/object/public/cabins-image/${imageName}`;

        // 1. Create/edit cabin
    let query = supabase.from("Cabins");

            // A) CREATE
    if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

            // B) EDIT
    if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

    const { data, error } = await query.select().single();

    if (error) {
        console.error(error);
        throw new Error("Cabin could not be created");
    }

    // 2. Upload image
    if (hasImagePath) return data;

    const { error: storageError } = await supabase.storage
        .from("cabins-image")
        .upload(imageName, newCabin.image);

    // 3. Delete the cabin IF there was an error uplaoding image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.error(storageError);
        throw new Error(
        "Cabin image could not be uploaded and the cabin was not created"
        );
    }
    return data;
}

export async function deleteCabin (id) {

    const { data, error } = await supabase
    .from('Cabins')
    .delete()
    .eq('id', id)

    if (error) {
        console.error (error);
        throw new Error ("Cabins could not be deleted")
    }
    return data

}