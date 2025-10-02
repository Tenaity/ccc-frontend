# iOS/Apple Design System Components

Bộ components thiết kế theo ngôn ngữ thiết kế của Apple (iOS/macOS style) kết hợp với Tailwind CSS glassmorphism.

## 🎨 Design Tokens

### Colors
- **iOS System Colors**: `ios-blue`, `ios-green`, `ios-indigo`, `ios-orange`, `ios-pink`, `ios-purple`, `ios-red`, `ios-teal`, `ios-yellow`
- **Gray Scale**: `ios-gray` (với variants 2-6)

### Typography (SF Pro Font Stack)
- `text-ios-large-title` - 34px/700
- `text-ios-title-1` - 28px/700
- `text-ios-title-2` - 22px/700
- `text-ios-title-3` - 20px/600
- `text-ios-body` - 17px/400
- `text-ios-callout` - 16px/400
- `text-ios-subhead` - 15px/400
- `text-ios-footnote` - 13px/400
- `text-ios-caption-1` - 12px/400
- `text-ios-caption-2` - 11px/400

### Border Radius
- `rounded-ios-sm` - 10px
- `rounded-ios` - 14px
- `rounded-ios-lg` - 20px
- `rounded-ios-xl` - 28px

### Shadows
- `shadow-ios-sm` - Subtle shadow
- `shadow-ios` - Default shadow
- `shadow-ios-lg` - Large shadow
- `shadow-ios-xl` - Extra large shadow
- `shadow-glass` - Glass effect shadow
- `shadow-glass-lg` - Large glass shadow

### Glassmorphism
- `glass` - Standard glass effect
- `glass-strong` - Strong glass effect (more blur)
- `glass-subtle` - Subtle glass effect

## 📦 Components

### IOSButton

```tsx
import { IOSButton } from "@/components/ios";

// Variants
<IOSButton variant="primary">Primary</IOSButton>
<IOSButton variant="secondary">Secondary</IOSButton>
<IOSButton variant="destructive">Delete</IOSButton>
<IOSButton variant="glass">Glass</IOSButton>
<IOSButton variant="glass-strong">Glass Strong</IOSButton>
<IOSButton variant="outline">Outline</IOSButton>
<IOSButton variant="ghost">Ghost</IOSButton>
<IOSButton variant="link">Link</IOSButton>

// Sizes
<IOSButton size="sm">Small</IOSButton>
<IOSButton size="md">Medium</IOSButton>
<IOSButton size="lg">Large</IOSButton>
<IOSButton size="icon"><Icon /></IOSButton>
```

### IOSCard

```tsx
import {
  IOSCard,
  IOSCardHeader,
  IOSCardTitle,
  IOSCardDescription,
  IOSCardContent,
  IOSCardFooter,
} from "@/components/ios";

<IOSCard variant="default">
  <IOSCardHeader>
    <IOSCardTitle>Card Title</IOSCardTitle>
    <IOSCardDescription>Card description</IOSCardDescription>
  </IOSCardHeader>
  <IOSCardContent>
    <p>Card content goes here</p>
  </IOSCardContent>
  <IOSCardFooter>
    <IOSButton>Action</IOSButton>
  </IOSCardFooter>
</IOSCard>

// Glass variants
<IOSCard variant="glass">...</IOSCard>
<IOSCard variant="glass-strong">...</IOSCard>
```

### IOSList & IOSListItem

```tsx
import { IOSList, IOSListItem } from "@/components/ios";
import { Settings, User, Bell } from "lucide-react";

<IOSList>
  <IOSListItem
    leading={<Settings className="h-6 w-6" />}
    title="Settings"
    subtitle="Manage your preferences"
    showChevron
    interactive
    onClick={() => {}}
  />
  <IOSListItem
    leading={<User className="h-6 w-6" />}
    title="Profile"
    trailing={<span className="text-ios-blue">Edit</span>}
    showChevron
    interactive
  />
  <IOSListItem
    leading={<Bell className="h-6 w-6" />}
    title="Notifications"
    trailing={<Switch />}
  />
</IOSList>
```

## 🛠 Utility Classes

### Glass Effects
```tsx
// Apply to any element
<div className="glass">...</div>
<div className="glass-strong">...</div>
<div className="glass-subtle">...</div>
```

### iOS-Style Card
```tsx
<div className="ios-card">
  <p>Content with iOS styling</p>
</div>
```

### iOS-Style List Item
```tsx
<div className="ios-list-item">
  <p>List item with iOS styling</p>
</div>
```

### Active State
```tsx
<button className="ios-active">
  Click me (bounces on click)
</button>
```

### Safe Area Support (for mobile)
```tsx
<div className="safe-top">Top padding respects notch</div>
<div className="safe-bottom">Bottom padding respects home indicator</div>
```

### iOS Navbar
```tsx
<header className="ios-navbar">
  <h1>Large Title</h1>
</header>
```

### iOS Overlay (Modal backdrop)
```tsx
<div className="ios-overlay" />
```

### iOS Scrollbar
```tsx
<div className="scrollbar-ios overflow-auto">
  Long content...
</div>
```

## 🎭 Animations

### iOS Bounce
```tsx
<div className="animate-ios-bounce">
  Bounces once
</div>
```

### Slide Animations
```tsx
<div className="animate-slide-up">Slides up</div>
<div className="animate-slide-down">Slides down</div>
```

### Fade In
```tsx
<div className="animate-fade-in">Fades in</div>
```

## ⚡ Transitions

iOS-style easing curves:
```tsx
<div className="transition-ios">Default iOS easing</div>
<div className="ease-ios-in">iOS ease-in</div>
<div className="ease-ios-out">iOS ease-out</div>
<div className="ease-ios-in-out">iOS ease-in-out</div>
```

## 📱 Best Practices

1. **Font Family**: Use `font-sf-pro` for SF Pro font stack
2. **Active States**: All buttons have `active:scale-95` by default
3. **Accessibility**: All components support ARIA attributes and keyboard navigation
4. **Dark Mode**: All utilities support dark mode variants
5. **Performance**: Use `backdrop-filter` wisely (can be GPU intensive)

## 🎨 Example: Complete Page

```tsx
import { IOSCard, IOSList, IOSListItem, IOSButton } from "@/components/ios";
import { Settings, User, Bell } from "lucide-react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-ios-gray-6 dark:bg-slate-950 safe-top safe-bottom">
      {/* Navbar */}
      <header className="ios-navbar px-4 py-6">
        <h1 className="font-sf-pro text-ios-large-title font-bold">
          Dashboard
        </h1>
      </header>

      {/* Content */}
      <main className="container mx-auto p-4 space-y-4">
        {/* Stats Card */}
        <IOSCard variant="glass-strong">
          <IOSCardHeader>
            <IOSCardTitle>Statistics</IOSCardTitle>
            <IOSCardDescription>Your performance metrics</IOSCardDescription>
          </IOSCardHeader>
          <IOSCardContent>
            {/* Stats content */}
          </IOSCardContent>
        </IOSCard>

        {/* Settings List */}
        <IOSList>
          <IOSListItem
            leading={<Settings />}
            title="Settings"
            showChevron
            interactive
          />
          <IOSListItem
            leading={<User />}
            title="Profile"
            trailing="Edit"
            showChevron
            interactive
          />
          <IOSListItem
            leading={<Bell />}
            title="Notifications"
            trailing={<Switch />}
          />
        </IOSList>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <IOSButton variant="primary" className="flex-1">
            Save Changes
          </IOSButton>
          <IOSButton variant="glass" className="flex-1">
            Cancel
          </IOSButton>
        </div>
      </main>
    </div>
  );
}
```

## 🔄 Migration từ shadcn/ui

Bạn có thể dùng cả 2 design systems song song:

```tsx
// shadcn/ui components
import { Button } from "@/components/ui/button";

// iOS components
import { IOSButton } from "@/components/ios";

<Button>shadcn Button</Button>
<IOSButton>iOS Button</IOSButton>
```

## 📚 Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [iOS Design System](https://developer.apple.com/design/resources/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
