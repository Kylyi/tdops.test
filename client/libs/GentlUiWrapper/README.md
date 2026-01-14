# GentlUI

A custom wrapper library around GentlUI components for enhanced functionality and consistent styling.

## Overview

This library provides custom wrappers around GentlUI components, offering additional features, standardized configurations, and improved developer experience.

## Installation

```bash
npm install @your-org/gentl-ui
```

## Usage

### Basic Component Usage

```typescript
import { Button, Input, Card } from '@your-org/gentl-ui';

function MyComponent() {
    return (
        <Card>
            <Input placeholder="Enter text" />
            <Button variant="primary">Submit</Button>
        </Card>
    );
}
```

### Custom Wrapper Features

- **Enhanced Props**: Additional properties for common use cases
- **Consistent Styling**: Pre-configured themes and variants
- **Type Safety**: Full TypeScript support
- **Accessibility**: Built-in ARIA attributes and keyboard navigation

## Available Components

- `Button` - Enhanced button with loading states and variants
- `Input` - Form input with validation and error handling
- `Card` - Container component with elevation and spacing
- `Modal` - Dialog component with backdrop and animations
- `Table` - Data table with sorting and pagination

## Configuration

```typescript
import { GentlUIProvider } from '@your-org/gentl-ui';

function App() {
    return (
        <GentlUIProvider theme="light">
            {/* Your app components */}
        </GentlUIProvider>
    );
}
```

## Contributing

Please refer to the contributing guidelines for development setup and submission process.
