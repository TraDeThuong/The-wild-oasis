# Hướng Dẫn Sử Dụng Supabase Trong Dự Án The Wild Oasis

### Supabase Là Gì?

**Supabase** là một nền tảng open-source thay thế cho Firebase. Nó cung cấp cho chúng ta:

- **Cơ sở dữ liệu PostgreSQL** (một loại database rất mạnh)
- **Authentication** (đăng nhập/đăng ký người dùng)
- **File Storage** (lưu trữ file như ảnh)
- **Real-time subscriptions** (cập nhật dữ liệu real-time)
- **API tự động** (RESTful API và GraphQL)

Hãy tưởng tượng Supabase như một "máy chủ ảo" giúp chúng ta lưu trữ và quản lý dữ liệu mà không cần tự xây dựng server.

### Tại Sao Chúng Ta Cần Supabase?

Trước khi có Supabase, việc xây dựng backend rất phức tạp:
- Cần thiết lập database
- Viết API endpoints
- Xử lý authentication
- Quản lý file uploads
- Bảo mật dữ liệu

Supabase giúp chúng ta làm tất cả những việc này một cách nhanh chóng và dễ dàng!

## Cách Thiết Lập Supabase

### 1. Tạo Project Supabase

1. Đăng ký tài khoản tại [supabase.com](https://supabase.com)
2. Tạo một project mới
3. Supabase sẽ cung cấp cho bạn:
   - **URL**: Địa chỉ của project (ví dụ: `https://pfqftttjuxrgmsbpmfsf.supabase.co`)
   - **API Key**: Khóa để truy cập project

### 2. Cấu Hình Trong Dự Án

Trong file `src/services/supabase.js`, chúng ta thiết lập kết nối:

```javascript
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://pfqftttjuxrgmsbpmfsf.supabase.co'
const supabaseKey = "sb_publishable_yTq1IDuR6xjowszRMtQ9ug_QtaGyLX2"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
```

**Giải thích:**
- `supabaseUrl`: Địa chỉ của project Supabase
- `supabaseKey`: Khóa công khai (public key) để truy cập
- `createClient`: Tạo kết nối đến Supabase

⚠️ **Quan trọng**: Không bao giờ commit `supabaseKey` vào Git! Nó nên được lưu trong biến môi trường.

## Cơ Sở Dữ Liệu (Database)

### 1. Bảng (Tables)

Trong Supabase, dữ liệu được lưu trong các bảng (tables). Trong dự án của chúng ta có các bảng chính:

- **Cabins**: Thông tin về các phòng
- **Bookings**: Thông tin đặt phòng
- **Guests**: Thông tin khách hàng
- **Setting**: Cài đặt của ứng dụng

### 2. Các Thao Tác Cơ Bản (CRUD)

#### Tạo Dữ Liệu (Create)

```javascript
// Thêm một cabin mới
const { data, error } = await supabase
  .from('Cabins')
  .insert([{ name: 'Ocean View', maxCapacity: 4, price: 250 }])
  .select()

if (error) {
  console.error(error)
  throw new Error("Cabin could not be created")
}
return data
```

#### Đọc Dữ Liệu (Read)

```javascript
// Lấy tất cả cabins
const { data, error } = await supabase
  .from('Cabins')
  .select('*')

if (error) {
  console.error(error)
  throw new Error("Cabins could not be loaded")
}
return data
```

#### Cập Nhật Dữ Liệu (Update)

```javascript
// Cập nhật thông tin cabin
const { data, error } = await supabase
  .from('Cabins')
  .update({ price: 300 })
  .eq('id', cabinId)
  .select()

if (error) {
  console.error(error)
  throw new Error("Cabin could not be updated")
}
return data
```

#### Xóa Dữ Liệu (Delete)

```javascript
// Xóa một cabin
const { data, error } = await supabase
  .from('Cabins')
  .delete()
  .eq('id', cabinId)

if (error) {
  console.error(error)
  throw new Error("Cabin could not be deleted")
}
return data
```

### 3. Truy Vấn Nâng Cao

#### Lọc Dữ Liệu (Filtering)

```javascript
// Lấy cabins có giá dưới 300
const { data } = await supabase
  .from('Cabins')
  .select('*')
  .lt('price', 300)  // lt = less than
```

#### Sắp Xếp (Ordering)

```javascript
// Sắp xếp cabins theo giá tăng dần
const { data } = await supabase
  .from('Cabins')
  .select('*')
  .order('price', { ascending: true })
```

#### Join Bảng (Relationships)

```javascript
// Lấy booking kèm thông tin cabin và guest
const { data } = await supabase
  .from('bookings')
  .select('*, cabins(*), guests(*)')
  .eq('id', bookingId)
  .single()
```

## Lưu Trữ File (Storage)

Supabase cung cấp dịch vụ lưu trữ file, rất hữu ích cho việc upload ảnh.

### 1. Upload File

```javascript
// Upload ảnh cabin
const imageName = `${Math.random()}-${file.name}`.replaceAll("/", "")

const { error } = await supabase.storage
  .from('cabins-image')  // Tên bucket
  .upload(imageName, file)

if (error) {
  throw new Error("Image could not be uploaded")
}
```

### 2. Tạo URL Công Khai

```javascript
// Tạo URL để truy cập ảnh
const imageUrl = `${supabaseUrl}/storage/v1/object/public/cabins-image/${imageName}`
```

### 3. Xóa File

```javascript
// Xóa file khỏi storage
const { error } = await supabase.storage
  .from('cabins-image')
  .remove([imageName])
```

## Xác Thực (Authentication)

Supabase cung cấp hệ thống authentication hoàn chỉnh.

### 1. Đăng Ký (Sign Up)

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

### 2. Đăng Nhập (Sign In)

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### 3. Đăng Xuất (Sign Out)

```javascript
const { error } = await supabase.auth.signOut()
```

### 4. Lấy Thông Tin User Hiện Tại

```javascript
const { data: { user } } = await supabase.auth.getUser()
```

## Ví Dụ Trong Dự Án

### Quản Lý Cabins

```javascript
// services/apiCabins.js

// Lấy tất cả cabins
export async function getCabins() {
  const { data, error } = await supabase
    .from('Cabins')
    .select('*')

  if (error) {
    console.error(error)
    throw new Error("Cabins could not be loaded")
  }
  return data
}

// Tạo cabin mới với ảnh
export async function createEditCabin(newCabin, id) {
  // 1. Xử lý upload ảnh
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl)
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "")
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabins-image/${imageName}`

  // 2. Tạo/cập nhật cabin trong database
  let query = supabase.from("Cabins")
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }])
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id)

  const { data, error } = await query.select().single()

  if (error) {
    console.error(error)
    throw new Error("Cabin could not be created")
  }

  // 3. Upload ảnh nếu cần
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabins-image")
      .upload(imageName, newCabin.image)

    if (storageError) {
      // Xóa cabin nếu upload ảnh thất bại
      await supabase.from("Cabins").delete().eq("id", data.id)
      throw new Error("Cabin image could not be uploaded")
    }
  }

  return data
}
```

### Quản Lý Bookings

```javascript
// services/apiBookings.js

// Lấy booking với thông tin liên quan
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single()

  if (error) {
    console.error(error)
    throw new Error("Booking not found")
  }

  return data
}

// Lấy bookings trong khoảng thời gian
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }))

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }

  return data
}
```

### Quản Lý Settings

```javascript
// services/apiSettings.js

// Lấy cài đặt (chỉ có 1 row)
export async function getSettings() {
  const { data, error } = await supabase
    .from("Setting")
    .select("*")
    .single()

  if (error) {
    console.error(error)
    throw new Error("Settings could not be loaded")
  }
  return data
}

// Cập nhật cài đặt
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("Setting")
    .update(newSetting)
    .eq("id", 1)
    .single()

  if (error) {
    console.error(error)
    throw new Error("Settings could not be updated")
  }
  return data
}
```

## Row Level Security (RLS)

Supabase có tính năng **Row Level Security** - bảo mật ở mức hàng. Điều này có nghĩa là:

- Người dùng chỉ có thể truy cập dữ liệu của chính họ
- Admin có thể truy cập tất cả dữ liệu
- Dữ liệu được bảo vệ tự động ở database level

Trong Supabase dashboard, bạn có thể cấu hình RLS policies cho từng bảng.

## Real-time Features

Supabase hỗ trợ real-time subscriptions:

```javascript
// Lắng nghe thay đổi trên bảng cabins
const channel = supabase
  .channel('cabins-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'Cabins' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## Công Cụ Supabase

### 1. Supabase Dashboard

- Quản lý database tables
- Xem và chỉnh sửa dữ liệu
- Cấu hình authentication
- Quản lý storage buckets
- Giám sát API usage

### 2. Supabase CLI

```bash
# Cài đặt CLI
npm install -g supabase

# Đăng nhập
supabase login

# Khởi tạo project local
supabase init

# Chạy local development
supabase start
```

### 3. Supabase Client trong Code

```javascript
// Import
import { createClient } from '@supabase/supabase-js'

// Tạo client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Sử dụng
const { data, error } = await supabase.from('table').select('*')
```

## Lưu Ý Bảo Mật

### 1. Environment Variables

```javascript
// .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. API Keys

- **anon key**: Cho client-side (frontend)
- **service_role key**: Cho server-side (backend) - KHÔNG được dùng ở client

### 3. RLS Policies

Luôn bật RLS và cấu hình policies phù hợp cho từng bảng.

## Kết Luận

Supabase giúp chúng ta xây dựng backend một cách nhanh chóng và dễ dàng. Trong dự án The Wild Oasis, chúng ta sử dụng Supabase để:

- Quản lý dữ liệu cabins, bookings, guests, settings
- Upload và lưu trữ ảnh cabins
- Xử lý authentication (sẽ được triển khai đầy đủ)
- Cung cấp API cho React Query

Supabase là một lựa chọn tuyệt vời cho các dự án cần backend nhanh, đặc biệt là khi làm việc với React.

Nếu bạn có câu hỏi nào khác về Supabase hoặc cần ví dụ cụ thể hơn, hãy cho chúng tôi biết!

---