# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Shadcn UI Tooltip component for Weweb.io** - a Vue.js component that implements the complete Shadcn UI Tooltip design system as a custom element for the Weweb no-code platform.

**🎯 Project Philosophy**: Create components with Shadcn UI styling that are **completely independent** from WeWeb's native components to avoid deprecation risks and maintain full control over functionality and design.

## Architecture

### Core Structure
- **Single Vue Component**: `src/wwElement.vue` - Main component with template, script, and scoped styles
- **Weweb Configuration**: `ww-config.js` - Defines component properties, sections, and editor UI
- **Component Type**: Custom Weweb element with bindable properties and event triggers

### Key Architectural Patterns
- **Independence First**: No dependency on WeWeb native components (icons, buttons, etc.)
- **Teleport Rendering**: Uses Vue's Teleport to render tooltip in document body
- **HSL Color System**: All colors use exact HSL values from Shadcn UI specification
- **Dynamic Positioning**: Smart positioning with viewport boundary detection
- **Event Emission**: Tooltip events trigger Weweb's event system via `trigger-event`
- **Self-Contained**: All dependencies loaded via CDN, no WeWeb component dependencies

## Development Commands

### Local Development
```bash
npm install
npm run serve
```
Development server runs at: `https://localhost:8080`

### Production Build
```bash
npm run build
```

### Testing
Open `test-final.html` in browser to test all tooltip configurations locally.

## Component Configuration

### Available Placements (4 total)
- `top` - Tooltip appears above the trigger element
- `bottom` - Tooltip appears below the trigger element
- `left` - Tooltip appears to the left of the trigger element
- `right` - Tooltip appears to the right of the trigger element

### Available Sizes (3 total)
- `sm` - Small tooltip (text-xs, px-2 py-1)
- `default` - Standard tooltip (text-sm, px-3 py-1.5)
- `lg` - Large tooltip (text-sm, px-4 py-2)

### Available Triggers (3 total)
- `hover` - Show on mouse hover (default)
- `focus` - Show on keyboard focus
- `click` - Show on click event

### Key Features
- **Smart Positioning**: Automatically adjusts to stay within viewport
- **Delay Controls**: Configurable show/hide delays
- **Arrow Indicator**: Optional arrow pointing to trigger element
- **Keyboard Accessible**: Proper focus management and ARIA support
- **Portal Rendering**: Uses Teleport for proper z-index layering

### Bindable Properties
- `content` - Complete tooltip configuration object

### Content Object Structure
```javascript
{
  text: 'Tooltip text content',
  placement: 'top', // 'top', 'bottom', 'left', 'right'
  size: 'default', // 'sm', 'default', 'lg'
  trigger: 'hover', // 'hover', 'focus', 'click'
  delay: 700, // Show delay in milliseconds
  hideDelay: 300, // Hide delay in milliseconds
  offset: 8, // Distance from trigger element
  disabled: false, // Disable tooltip
  showArrow: true, // Show/hide arrow indicator
  triggerText: 'Hover me', // Default trigger text if no slot content
  triggerClass: '', // Additional CSS classes for trigger
  customClass: '' // Additional CSS classes for tooltip
}
```

## Weweb Integration

### Import in Weweb Editor
1. Import coded component from GitHub repository
2. Select the desired version/tag
3. Configure via Settings panel

### Property Organization
Configuration is organized in logical sections in the Weweb editor:
- **Content**: Tooltip text and trigger settings
- **Style**: Placement, size, and appearance options
- **Behavior**: Trigger type, delays, and interaction settings

### Slot Support
- **Default Slot**: Custom trigger content instead of default text
- **Flexible Content**: Any HTML element can be used as trigger

## CSS Architecture

### Scoped Styling
- Uses Vue scoped styles to prevent conflicts
- Tailwind CSS classes for consistent Shadcn UI styling
- Exact HSL color values matching Shadcn UI specification
- Proper focus states and accessibility support

### Style Organization
1. Global Shadcn UI styles import (`globals.css`)
2. Component-specific positioning logic
3. Animation classes for smooth show/hide transitions
4. Arrow styling with proper border handling

### Animation System
- **Fade In**: Smooth opacity transition on show
- **Zoom In**: Scale effect on appearance (zoom-in-95)
- **Slide Effects**: Direction-based slide animations
- **CSS Animations**: Hardware-accelerated transitions

## Positioning System

### Smart Positioning
- **Viewport Detection**: Automatically adjusts when tooltip would overflow
- **Dynamic Calculation**: Real-time position updates on scroll/resize
- **Offset Control**: Configurable distance from trigger element
- **Center Alignment**: Tooltips center-aligned with trigger when possible

### Position Logic
1. Calculate ideal position based on placement
2. Check viewport boundaries
3. Adjust position to stay within bounds
4. Update arrow position accordingly

## Accessibility Features

### Screen Reader Support
- **Role Tooltip**: Proper ARIA role for assistive technology
- **Focus Management**: Keyboard navigation support
- **Tabindex Control**: Proper tab order when disabled

### Keyboard Support
- **Tab Navigation**: Focus triggers show tooltip
- **Escape Key**: Can dismiss tooltip on focus
- **Focus Indicators**: Clear focus states for keyboard users

## File Dependencies

- **@weweb/cli**: Required for build and serve commands
- **Vue.js**: Component framework (provided by Weweb runtime)
- **Tailwind CSS**: Utility-first CSS framework for Shadcn UI styling
- **No WeWeb Components**: Completely independent of WeWeb's native component library

## Independence Strategy

This component is designed to be **completely independent** from WeWeb's native components:

### Why Independence?
- **No Deprecation Risk**: WeWeb components can become obsolete
- **Full Control**: Complete control over styling and functionality
- **Consistency**: Guaranteed Shadcn UI compliance
- **Reliability**: Self-contained architecture ensures stability

### Implementation
- Portal rendering via Vue Teleport instead of WeWeb overlays
- Custom positioning logic instead of WeWeb tooltip system
- Self-contained component with minimal external dependencies
- Future-proof architecture for long-term projects