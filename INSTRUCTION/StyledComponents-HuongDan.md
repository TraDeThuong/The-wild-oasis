# Hướng Dẫn Sử Dụng Styled Components Trong Dự Án The Wild Oasis

### Styled Components Là Gì?

**Styled Components** là một thư viện cho phép bạn viết CSS trực tiếp trong file JavaScript/TypeScript của React. Thay vì tạo file CSS riêng biệt, bạn có thể viết CSS ngay bên trong component.

Hãy tưởng tượng bạn đang viết CSS nhưng có thể sử dụng sức mạnh của JavaScript để tạo style động!

### Tại Sao Chúng Ta Cần Styled Components?

Trước khi có Styled Components, việc styling React components rất phức tạp:
- Tạo nhiều file CSS riêng biệt
- Quản lý class names (dễ bị trùng lặp)
- CSS không có scope (có thể bị ghi đè)
- Khó tạo style động dựa trên props

Styled Components giải quyết tất cả những vấn đề này!

## Cách Cài Đặt và Sử Dụng Cơ Bản

### 1. Cài Đặt

```bash
npm install styled-components
```

### 2. Import

```javascript
import styled from "styled-components"
```

### 3. Tạo Component Cơ Bản

```javascript
// Tạo một button có style
const Button = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #4338ca;
  }
`

// Sử dụng trong JSX
function App() {
  return <Button>Click me!</Button>
}
```

## Các Khái Niệm Cơ Bản

### 1. Styled Components Cơ Bản

```javascript
import styled from "styled-components"

// Tạo styled component từ HTML element
const Button = styled.button`
  background: blue;
  color: white;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`
```

### 2. Props và Dynamic Styling

Styled Components có thể nhận props để tạo style động:

```javascript
const Button = styled.button`
  background-color: ${props => props.primary ? '#4f46e5' : '#e5e7eb'};
  color: ${props => props.primary ? 'white' : '#374151'};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
`

// Sử dụng
<Button primary>Primary Button</Button>
<Button>Secondary Button</Button>
```

### 3. CSS Helper Functions

#### css helper

```javascript
import styled, { css } from "styled-components"

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
  `
}

const Button = styled.button`
  background: blue;
  color: white;

  ${props => sizes[props.size]}
`

// Sử dụng
<Button size="small">Small Button</Button>
<Button size="large">Large Button</Button>
```

#### keyframes cho animation

```javascript
import styled, { keyframes } from "styled-components"

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${spin} 1s linear infinite;
`
```

## Ví Dụ Trong Dự Án

### Button Component

```javascript
// src/ui/Button.jsx
import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variations]}
`

Button.defaultProps = {
  variations: "primary",
  size: "medium",
}

export default Button;
```

**Giải thích:**
- `sizes`: Object chứa các size khác nhau
- `variations`: Object chứa các style variations
- `Button`: Styled component chính
- `defaultProps`: Giá trị mặc định cho props

### Form Component

```javascript
// src/ui/Form.jsx
import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type !== "modal" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}

  overflow: hidden;
  font-size: 1.4rem;
`;

export default Form;
```

**Giải thích:**
- Sử dụng conditional styling dựa trên prop `type`
- Khi `type !== "modal"`: Thêm padding và background
- Khi `type === "modal"`: Set width

### Global Styles

```javascript
// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    /* CSS Variables cho colors */
    --color-brand-50: #eef2ff;
    --color-brand-600: #4f46e5;
    --color-brand-700: #4338ca;

    /* Grey colors */
    --color-grey-0: #fff;
    --color-grey-50: #f9fafb;
    --color-grey-100: #f3f4f6;
    --color-grey-200: #e5e7eb;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);

    /* Border radius */
    --border-radius-sm: 5px;
    --border-radius-md: 7px;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: "Poppins", sans-serif;
    color: var(--color-grey-700);
    background-color: var(--color-grey-50);
  }
`;

export default GlobalStyles;
```

## CSS Variables (Biến CSS)

Trong dự án, chúng ta sử dụng CSS Variables để quản lý colors và các giá trị chung:

```css
:root {
  --color-brand-600: #4f46e5;
  --color-grey-100: #f3f4f6;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --border-radius-sm: 5px;
}
```

**Ưu điểm:**
- Dễ thay đổi theme
- Consistent across components
- Có thể thay đổi bằng JavaScript

## Advanced Patterns

### 1. Extending Styles

```javascript
const Button = styled.button`
  background: blue;
  color: white;
`

const PrimaryButton = styled(Button)`
  background: red;
`

const LargeButton = styled(Button)`
  font-size: 20px;
`
```

### 2. as prop

```javascript
const Button = styled.button`
  background: blue;
  color: white;
`

// Có thể render thành link
<Button as="a" href="/home">Home</Button>
```

### 3. attrs

```javascript
const Input = styled.input.attrs(props => ({
  type: props.type || "text",
  placeholder: props.placeholder || "Enter text..."
}))`
  padding: 10px;
  border: 1px solid #ccc;
`
```

## Theme Provider

Styled Components hỗ trợ theme:

```javascript
import { ThemeProvider } from "styled-components"

const theme = {
  colors: {
    primary: "#4f46e5",
    secondary: "#e5e7eb"
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  )
}

// Trong component
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
`
```

## Best Practices

### 1. Sử Dụng CSS Variables

```javascript
// Tốt
const Button = styled.button`
  color: var(--color-brand-50);
  background-color: var(--color-brand-600);
`

// Không tốt
const Button = styled.button`
  color: #eef2ff;
  background-color: #4f46e5;
`
```

### 2. Tách Logic Styling

```javascript
// Tốt
const getSizeStyles = (size) => {
  switch (size) {
    case 'small': return css`font-size: 12px;`
    case 'large': return css`font-size: 20px;`
    default: return css`font-size: 16px;`
  }
}

const Button = styled.button`
  ${props => getSizeStyles(props.size)}
`
```

### 3. Sử Dụng Semantic Naming

```javascript
// Tốt
const Card = styled.div`
  /* styles */
`

const CardTitle = styled.h2`
  /* styles */
`

// Không tốt
const Div1 = styled.div`
  /* styles */
`

const H2 = styled.h2`
  /* styles */
`
```

## Debugging

### 1. Class Names

Styled Components tự động tạo class names duy nhất, ví dụ:
```html
<button class="sc-bdnxRM kJkgpS">Click me</button>
```

### 2. DevTools

Cài đặt React DevTools và Styled Components DevTools để debug dễ dàng.

### 3. Source Maps

Styled Components hỗ trợ source maps để debug CSS.

## Performance

### 1. Code Splitting

```javascript
const LargeComponent = lazy(() => import('./LargeComponent'))
```

### 2. Memoization

```javascript
const StyledButton = styled.button`
  background: ${props => props.bg || 'blue'};
`

// Hoặc sử dụng React.memo
const Button = React.memo(styled.button`
  background: blue;
`)
```

## Kết Luận

Styled Components giúp chúng ta viết CSS một cách dễ dàng và mạnh mẽ trong React. Trong dự án The Wild Oasis, chúng ta sử dụng Styled Components để:

- Tạo các UI components có thể tái sử dụng
- Quản lý theme và colors với CSS Variables
- Tạo responsive design
- Viết CSS có scope và không bị conflict

Styled Components là một công cụ tuyệt vời để styling React applications, đặc biệt khi làm việc với design systems hoặc component libraries.

Nếu bạn có câu hỏi nào khác về Styled Components hoặc cần ví dụ cụ thể hơn, hãy cho chúng tôi biết!

---

*Tài liệu này được tạo để giúp người mới bắt đầu hiểu về Styled Components trong dự án The Wild Oasis. Nếu có gì cần bổ sung hoặc sửa đổi, hãy cho chúng tôi biết!*