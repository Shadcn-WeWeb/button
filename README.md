# Button Component

Beautiful button component with Shadcn UI design system for WeWeb platform.

## Features

- ✨ **8 variants**: default, destructive, outline, secondary, ghost, link, icon, loading
- 📏 **3 sizes**: small (36px), default (40px), large (44px)  
- 🎨 **Shadcn UI design system** with CSS variables
- 🌙 **Dark mode support** 
- ♿ **Accessibility** with ARIA and keyboard navigation
- 🔗 **WeWeb integration** with bindable properties
- 📱 **Responsive** and touch-friendly
- 🎯 **Lucide icons** support

## Installation

1. Add this component to your WeWeb project
2. The component will be available in the WeWeb editor

## Usage

### Basic Button
```javascript
// WeWeb editor configuration
{
  text: "Click me",
  variant: "default",
  size: "default"
}
```

### Variants
- `default` - Primary button (blue background)
- `destructive` - Danger button (red background)  
- `outline` - Outlined button
- `secondary` - Secondary button (gray background)
- `ghost` - Transparent button
- `link` - Text link style
- `icon` - Icon only button
- `loading` - Loading state with spinner

### With Icon
```javascript
{
  text: "Save",
  variant: "default", 
  showIcon: true,
  iconName: "save"
}
```

## Development

```bash
# Serve for development
npm run serve

# Build for production  
npm run build
```

## Part of Shadcn-WeWeb

This component is part of the **Shadcn-WeWeb** organization providing 48 beautiful, accessible Shadcn UI components for WeWeb.

## License

MIT