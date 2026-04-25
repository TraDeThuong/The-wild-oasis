# Compound Component Pattern Guide

## What is the Compound Component Pattern?

The Compound Component Pattern is a React design pattern that allows you to create a set of components that work together as a unit, sharing implicit state and behavior through a shared context. Instead of passing many props down through a component tree, child components can access shared state directly from context.

**Key Idea**: Components that work together are logically grouped under a main component, with each piece having its own responsibility but sharing state through context.

## Why Use It?

- **Reduces Prop Drilling**: No need to pass props through multiple levels
- **Clean API**: Components feel like a natural grouping (e.g., `<Modal.Open>`, `<Modal.Window>`)
- **Flexibility**: Easy to reorder or add new compound parts without changing the main component
- **Maintainability**: Logic is centralized in one place but UI is distributed
- **Composability**: Parts can be used independently or combined

## Core Concepts

### 1. **Main Component** (Parent)

- Manages shared state using `useState` or `useContext`
- Provides context to children
- Defines the API through static properties

### 2. **Compound Components** (Children)

- Small, focused components
- Share state through context
- Assigned as static properties of the main component

### 3. **Context**

- Carries state between components without prop drilling
- Created with `createContext()`
- Consumed with `useContext()`

## Real Example: Modal Component

Your `Modal.jsx` is an excellent example of this pattern:

```jsx
// Main component manages state and provides context
function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = (name) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Compound component 1: Trigger button
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

// Compound component 2: Modal window content
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  if (name !== openName) return null;
  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

// Assign as static properties
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
```

### Usage Pattern

```jsx
<Modal>
  <Modal.Open opens="cabin-form">
    <Button>Add Cabin</Button>
  </Modal.Open>

  <Modal.Window name="cabin-form">
    <CreateCabinForm />
  </Modal.Window>

  <Modal.Open opens="delete-cabin">
    <Button>Delete</Button>
  </Modal.Open>

  <Modal.Window name="delete-cabin">
    <ConfirmDelete />
  </Modal.Window>
</Modal>
```

## Benefits in Your Modal Example

✅ **No prop drilling**: `CreateCabinForm` doesn't need to know about modal state  
✅ **Clean API**: Clear which part opens and which part displays  
✅ **Multiple windows**: Can have multiple `Modal.Open` and `Modal.Window` pairs  
✅ **Flexible ordering**: Can place windows anywhere inside Modal  
✅ **Easy to extend**: Add new compound parts without changing existing code

## Step-by-Step: Creating a Compound Component

### Step 1: Create Context

```jsx
const MyContext = createContext();
```

### Step 2: Create Main Component

```jsx
function MyComponent({ children }) {
  const [state, setState] = useState(/* initial value */);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}
```

### Step 3: Create Compound Components

```jsx
function CompoundPart1({ children }) {
  const { state } = useContext(MyContext);
  return <div>{children}</div>;
}

function CompoundPart2() {
  const { state, setState } = useContext(MyContext);
  return <div>{state}</div>;
}
```

### Step 4: Assign as Static Properties

```jsx
MyComponent.Part1 = CompoundPart1;
MyComponent.Part2 = CompoundPart2;

export default MyComponent;
```

### Step 5: Use the Component

```jsx
<MyComponent>
  <MyComponent.Part1>Content</MyComponent.Part1>
  <MyComponent.Part2 />
</MyComponent>
```

## Best Practices

### ✅ DO:

1. **Keep compound components tightly related**

   ```jsx
   <Table>
     <Table.Header />
     <Table.Body />
     <Table.Footer />
   </Table>
   ```

2. **Use meaningful names** that indicate purpose

   ```jsx
   Modal.Open; // Opens the modal
   Modal.Window; // Shows the modal content
   ```

3. **Handle context gracefully** with error checking

   ```jsx
   function CompoundPart() {
     const context = useContext(MyContext);
     if (!context) {
       throw new Error("CompoundPart must be used within MyComponent");
     }
     return <div>{context.value}</div>;
   }
   ```

4. **Use `cloneElement`** to pass callbacks or state to children

   ```jsx
   cloneElement(children, { onCloseModal: close });
   ```

5. **Document the API** clearly for other developers
   ```jsx
   /**
    * Modal compound component
    *
    * Usage:
    * <Modal>
    *   <Modal.Open opens="cabin-form">
    *     <Button>Open</Button>
    *   </Modal.Open>
    *   <Modal.Window name="cabin-form">
    *     <Form />
    *   </Modal.Window>
    * </Modal>
    */
   ```

### ❌ DON'T:

1. **Don't overuse contexts**
   - Keep child components simple
   - Avoid deeply nested shared state

2. **Don't mix unrelated components**

   ```jsx
   // Bad: Button and Form are not related enough
   <Container>
     <Container.Button />
     <Container.Form />
   </Container>
   ```

3. **Don't nest compounds too deeply**
   - Limit to 2-3 levels for clarity
   - Consider splitting if it becomes complex

4. **Don't forget to handle edge cases**
   ```jsx
   // Always check if context exists
   const { value } = useContext(MyContext) || {};
   ```

## Common Patterns

### Pattern 1: Toggle Component

```jsx
function Tabs({ children }) {
  const [activeId, setActiveId] = useState("");
  return (
    <TabContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </TabContext.Provider>
  );
}

Tabs.List = ({ children }) => <div className="tabs-list">{children}</div>;
Tabs.Button = ({ children, id }) => {
  const { activeId, setActiveId } = useContext(TabContext);
  return (
    <button
      className={activeId === id ? "active" : ""}
      onClick={() => setActiveId(id)}
    >
      {children}
    </button>
  );
};
Tabs.Content = ({ children, id }) => {
  const { activeId } = useContext(TabContext);
  return activeId === id ? <div>{children}</div> : null;
};
```

### Pattern 2: Accordion

```jsx
function Accordion({ children }) {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <AccordionContext.Provider value={{ expandedId, setExpandedId }}>
      {children}
    </AccordionContext.Provider>
  );
}

Accordion.Item = ({ children, id }) => (
  <div className="accordion-item">{children}</div>
);

Accordion.Header = ({ children, id }) => {
  const { expandedId, setExpandedId } = useContext(AccordionContext);
  return (
    <div
      onClick={() => setExpandedId(expandedId === id ? null : id)}
      className="accordion-header"
    >
      {children}
    </div>
  );
};

Accordion.Content = ({ children, id }) => {
  const { expandedId } = useContext(AccordionContext);
  return expandedId === id ? <div>{children}</div> : null;
};
```

### Pattern 3: Form Component

```jsx
function Form({ children, onSubmit }) {
  const [formData, setFormData] = useState({});
  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      <form onSubmit={onSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

Form.Input = ({ name, ...props }) => {
  const { formData, setFormData } = useContext(FormContext);
  return (
    <input
      {...props}
      value={formData[name] || ""}
      onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
    />
  );
};

Form.Submit = ({ children }) => <button type="submit">{children}</button>;
```

## Comparison: With and Without Compound Pattern

### Without Compound Pattern (Prop Drilling)

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Add Cabin"
  children={<CreateCabinForm />}
  closeButtonText="Close"
  onSubmit={handleSubmit}
  hasFooter={true}
/>
```

### With Compound Pattern

```jsx
<Modal>
  <Modal.Open opens="cabin-form">
    <Button>Add Cabin</Button>
  </Modal.Open>

  <Modal.Window name="cabin-form">
    <CreateCabinForm />
  </Modal.Window>
</Modal>
```

The compound pattern is cleaner, more flexible, and easier to understand!

## Tips for Your Project

1. **Identify groups of related components**
   - Modal (Open, Window) ✅ Already implemented
   - Table (Header, Body, Footer, Row)
   - Form (Input, Select, Submit)
   - Menu (Trigger, List, Item)

2. **Use the pattern for:**
   - UI components that need to manage shared state
   - Components with multiple parts that work together
   - Complex components with many optional parts

3. **Don't use for:**
   - Simple, standalone components
   - Components that don't share state
   - Heavily nested component trees

## Resources

- React Patterns: https://react-patterns.com/
- Compound Components: https://www.joshwcomeau.com/react/compound-components/
- Context API: https://react.dev/reference/react/useContext

---

**Your Modal.jsx is an excellent implementation of this pattern!** Use it as a reference when creating new compound components.
