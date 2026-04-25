# Sử Dụng React Query (TanStack Query) Trong Dự Án The Wild Oasis

### React Query Là Gì?

Hãy tưởng tượng bạn đang xây dựng một ứng dụng web như một khách sạn ảo (The Wild Oasis). Ứng dụng này cần lấy dữ liệu từ máy chủ (server) như danh sách phòng, đặt phòng, thông tin khách hàng, v.v.

**React Query** là một "người giúp việc" thông minh giúp bạn:
- **Lấy dữ liệu** từ máy chủ
- **Lưu trữ tạm thời** dữ liệu để không phải tải lại nhiều lần
- **Cập nhật dữ liệu** khi có thay đổi
- **Xử lý lỗi** khi việc lấy dữ liệu thất bại

### Tại Sao Chúng Ta Cần React Query?

Trước khi có React Query, việc quản lý dữ liệu từ máy chủ rất phức tạp:
- Bạn phải tự viết code để gọi API
- Phải tự quản lý trạng thái loading (đang tải)
- Phải tự xử lý lỗi
- Dữ liệu có thể bị cũ mà không cập nhật

React Query giúp bạn làm tất cả những việc này một cách tự động và dễ dàng!

## Cách Hoạt Động Cơ Bản

### 1. QueryClient - "Người Quản Lý Chính"

Trong dự án của chúng ta, ở file `App.jsx`, chúng ta tạo một `QueryClient`:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Dữ liệu "tươi" trong 60 giây
    }
  }
})
```

`QueryClient` như một "kho dữ liệu" trung tâm. Nó quản lý tất cả dữ liệu từ máy chủ.

### 2. QueryProvider - "Người Bao Bọc"

Chúng ta bọc toàn bộ ứng dụng bằng `QueryClientProvider`:

```javascript
<QueryClientProvider client={queryClient}>
  {/* Toàn bộ ứng dụng React ở đây */}
</QueryClientProvider>
```

Điều này giúp tất cả component trong ứng dụng có thể sử dụng React Query.

### 3. ReactQueryDevtools - "Công Cụ Phát Triển"

```javascript
<ReactQueryDevtools initialIsOpen={false} />
```

Đây là công cụ giúp developer (người phát triển) xem và debug dữ liệu. Bạn có thể mở nó bằng cách nhấn F12 và tìm tab "React Query".

## Các Khái Niệm Cơ Bản

### 1. Query - "Yêu Cầu Lấy Dữ Liệu"

Query là cách chúng ta lấy dữ liệu từ máy chủ. Ví dụ:

```javascript
// Trong file useCabins.js
const { isLoading, data: cabins, error } = useQuery({
  queryKey: ['cabins'],        // Tên định danh cho dữ liệu này
  queryFn: getCabins,          // Hàm gọi API để lấy dữ liệu
  staleTime: 0                 // Dữ liệu cũ sau 0ms (luôn tươi)
})
```

**Giải thích:**
- `queryKey`: Như một "nhãn tên" cho dữ liệu. React Query dùng nó để tìm và lưu dữ liệu.
- `queryFn`: Hàm thực sự gọi API để lấy dữ liệu từ máy chủ.
- `isLoading`: `true` khi đang tải dữ liệu, `false` khi xong.
- `data`: Dữ liệu đã lấy được (ở đây là danh sách cabins).
- `error`: Thông tin lỗi nếu có.

### 2. Mutation - "Yêu Cầu Thay Đổi Dữ Liệu"

Mutation dùng để thay đổi dữ liệu trên máy chủ (thêm, sửa, xóa). Ví dụ:

```javascript
// Trong file useCreateCabin.js
const { mutate: createCabin, isLoading: isCreating } = useMutation({
  mutationFn: (newCabinData) => createEditCabin(newCabinData, undefined),
  onSuccess: () => {
    toast.success("New cabin successfully created")
    queryClient.invalidateQueries({ queryKey: ["cabins"] })
  },
  onError: (err) => toast.error(err.message)
})
```

**Giải thích:**
- `mutationFn`: Hàm thực hiện thay đổi dữ liệu.
- `onSuccess`: Chạy khi thành công (hiển thị thông báo, cập nhật dữ liệu).
- `onError`: Chạy khi có lỗi (hiển thị thông báo lỗi).
- `invalidateQueries`: "Làm mất hiệu lực" dữ liệu cũ, buộc React Query tải lại.

## Ví Dụ Trong Dự Án

### Lấy Danh Sách Cabins (Phòng)

```javascript
// Trong component Cabins
const { isLoading, cabins, error } = useCabins()

if (isLoading) return <Spinner />
if (error) return <div>Có lỗi xảy ra: {error.message}</div>

return (
  <div>
    {cabins.map(cabin => (
      <div key={cabin.id}>{cabin.name}</div>
    ))}
  </div>
)
```

### Tạo Cabin Mới

```javascript
// Trong form tạo cabin
const { createCabin, isCreating } = useCreateCabin()

const handleSubmit = (data) => {
  createCabin(data) // Gọi mutation
}

return (
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
    <button disabled={isCreating}>
      {isCreating ? 'Đang tạo...' : 'Tạo Cabin'}
    </button>
  </form>
)
```

## Các Hook Quan Trọng Trong Dự Án

### Cabin Hooks
- `useCabins()`: Lấy danh sách tất cả cabins
- `useCreateCabin()`: Tạo cabin mới
- `useEditCabin()`: Sửa cabin
- `useDeleteCabin()`: Xóa cabin

### Booking Hooks
- `useBookings()`: Lấy danh sách bookings
- Tương tự cho create, edit, delete bookings

### Settings Hooks
- `useSettings()`: Lấy cài đặt
- `useUpdateSetting()`: Cập nhật cài đặt

## Ưu Điểm Của React Query

### 1. Tự Động Cache (Lưu Tạm)
- Dữ liệu được lưu trong bộ nhớ, không cần tải lại khi dùng lại
- Tự động xóa cache cũ

### 2. Background Refetch (Tải Lại Ngầm)
- Tự động tải lại dữ liệu khi component mount lại
- Người dùng không thấy loading

### 3. Error Handling (Xử Lý Lỗi)
- Tự động retry khi lỗi mạng
- Dễ dàng hiển thị lỗi cho người dùng

### 4. Loading States (Trạng Thái Tải)
- Biết chính xác khi nào đang tải dữ liệu
- Hiển thị spinner hoặc skeleton loading

### 5. Optimistic Updates (Cập Nhật Tối Ưu)
- Cập nhật UI ngay lập tức, sau đó đồng bộ với server
- Trải nghiệm người dùng mượt mà hơn

## Cách Sử Dụng Trong Code

### Bước 1: Tạo API Service
```javascript
// services/apiCabins.js
export async function getCabins() {
  const res = await fetch('/api/cabins')
  if (!res.ok) throw new Error('Failed to fetch cabins')
  return res.json()
}
```

### Bước 2: Tạo Custom Hook
```javascript
// features/cabins/useCabins.js
import { useQuery } from "@tanstack/react-query"
import { getCabins } from "../../services/apiCabins"

export function useCabins() {
  const { isLoading, data: cabins, error } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  })

  return { isLoading, error, cabins }
}
```

### Bước 3: Sử Dụng Trong Component
```javascript
// pages/Cabins.jsx
import { useCabins } from '../features/cabins/useCabins'

export default function Cabins() {
  const { isLoading, cabins, error } = useCabins()

  if (isLoading) return <Spinner />
  if (error) return <ErrorFallback error={error} />

  return (
    <div>
      {cabins?.map(cabin => <CabinRow key={cabin.id} cabin={cabin} />)}
    </div>
  )
}
```

## Các Lưu Ý Quan Trọng

### 1. Query Keys
- Phải unique (duy nhất) cho mỗi loại dữ liệu
- Có thể là array: `['cabins', cabinId]` cho dữ liệu cụ thể

### 2. Stale Time
- Thời gian dữ liệu được coi là "tươi"
- Sau thời gian này, dữ liệu sẽ được refetch khi cần

### 3. Cache Time
- Thời gian dữ liệu được giữ trong cache
- Mặc định là 5 phút

### 4. Error Boundaries
- Sử dụng Error Boundaries để catch lỗi React Query
- Trong dự án chúng ta có `ErrorFallback` component

## Kết Luận

React Query giúp chúng ta quản lý dữ liệu từ máy chủ một cách dễ dàng và hiệu quả. Nó loại bỏ rất nhiều code boilerplate (lặp lại) và cung cấp trải nghiệm người dùng tốt hơn.

Trong dự án The Wild Oasis, React Query được sử dụng để:
- Quản lý dữ liệu cabins, bookings, settings
- Xử lý authentication (đăng nhập)
- Tương tác với Supabase database

Nếu bạn có câu hỏi nào khác về React Query hoặc cần ví dụ cụ thể hơn, hãy hỏi chúng tôi!

---
