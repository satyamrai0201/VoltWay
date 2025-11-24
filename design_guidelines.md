# VoltWay Design Guidelines

## Design Approach
**Reference-Based Design**: Strictly match the provided screenshot references (Screenshot 2025-11-24 at 2.33.10 PM.png and 2.33.29 PM.png). The design language draws from modern SaaS platforms with bold typography, generous spacing, and neon accent treatments.

## Core Design Principles
1. **Breathable & Clean**: Prioritize white space over content density
2. **Bold Typography First**: Large display text creates visual hierarchy
3. **Neon Accent Pop**: Lime green (#CCFF00 or similar) as primary accent against neutral base
4. **Rounded & Soft**: All containers use generous 28px border radius
5. **Minimal Chrome**: Interface elements should feel invisible until needed

## Typography System

**Display Typography** (Landing/Hero sections):
- Hero Headline: 72-96px, ultra-bold (800-900 weight), tight leading (0.95-1.0)
- Section Headlines: 48-64px, bold (700-800 weight)
- Feature Titles: 32-40px, semibold (600-700 weight)

**Body Typography**:
- Primary: 18-20px, regular (400 weight), relaxed leading (1.6-1.8)
- Secondary: 16px, regular (400 weight)
- Small/Meta: 14px, medium (500 weight)

**Font Families**:
- Primary: Inter or similar geometric sans-serif
- Use single font family throughout for consistency

## Layout & Spacing System

**Spacing Units**: Use Tailwind units of 4, 8, 12, 16, 24, 32 consistently
- Component padding: p-8 to p-12
- Section spacing: py-24 to py-32
- Container max-width: max-w-7xl
- Content max-width: max-w-6xl

**Grid System**:
- Feature cards: 4-column grid on desktop (grid-cols-4)
- Station cards: 3-column grid on desktop (grid-cols-3)
- Mobile: Always single column

## Component Library

### Navigation
- **Style**: Pill-shaped container with subtle backdrop blur
- **Position**: Fixed top, centered, floating appearance (mt-4)
- **Contents**: Logo + nav links + profile/login CTA
- **Behavior**: Shrinks on scroll, maintains clarity

### Hero Section
- **Images**: Use provided hero graphics as primary visual elements
- **Layout**: Full-width, 80-90vh height
- **Typography**: Massive headline (VoltWay-style giant text from reference)
- **Badge**: "2M+ users" with avatar cluster
- **CTA**: Neon circular button "How it works?" - floating, prominent

### Feature Cards (Dark Section)
- **Container**: Large rounded cards (rounded-3xl = 28px)
- **Shadow**: Soft, multi-layer shadows (shadow-xl + subtle glow)
- **Icon Treatment**: Circular icon bubbles with gradient backgrounds
- **Separator**: Dotted lines between cards
- **Grid**: 4 equal columns, gap-8

### Station Cards
- **Image**: Hero image at top, 16:9 aspect ratio
- **Pricing**: Bold, prominent display
- **Status Indicators**: Availability badges (green dot + text)
- **Action**: Primary CTA button at bottom

### Modals
- **Background**: Backdrop blur (backdrop-blur-md) + dark overlay (bg-black/40)
- **Container**: Centered, max-w-2xl, rounded-3xl, p-12
- **Animation**: Fade + scale entrance (Framer Motion)

### Buttons
- **Primary (Neon)**: Lime green background, dark text, rounded-full, px-8 py-4
- **Secondary**: Dark background with white text, same rounded-full style
- **Floating CTAs**: Circular, shadow-2xl, subtle hover lift

### Dropdown Menus
- **Container**: Rounded-2xl, shadow-xl, backdrop-blur
- **Items**: Padding p-3, hover state with subtle background
- **Dividers**: Subtle border-gray-200/10

## Color Strategy
Colors will be defined separately. Focus on creating strong contrast between elements, using neutral base with vibrant accent pops.

## Visual Effects & Animation

**Framer Motion Applications**:
- Modal entry: Fade + scale from 0.95 to 1
- Dropdown: Scale from top with spring physics
- Station markers: Gentle bounce on hover
- Card reveals: Stagger fade-in on scroll
- Hover interactions: Subtle lift (translateY: -4px)

**Animation Timing**: Keep fast and snappy (200-300ms), use spring physics for organic feel

## Map Integration
- **Bounds**: Restrict view to India coordinates
- **Markers**: Custom circular markers with neon accent on active
- **Popup**: Match card style - rounded-2xl with shadow
- **Controls**: Minimal, custom-styled zoom controls

## Images

**Hero Section**:
- Use provided screenshot images as hero graphics
- Display as large, prominent visual elements
- Ensure images complement giant typography without competing

**Station Detail Pages**:
- Photo gallery carousel (3-5 images per station)
- 16:9 aspect ratio, rounded corners
- Lightbox view on click

**Profile Avatars**:
- Circular, 40-48px for headers
- 80-96px for profile pages
- Cluster display for social proof (2M+ users badge)

## Booking Flow UI
- **Status Timeline**: Horizontal progress tracker with icons
- **Steps**: Requested → Confirmed → En Route → Plugged → Charging → Completed
- **Active State**: Neon accent, completed states fade to neutral
- **Mobile**: Vertical timeline with smaller icons

## Footer
- **Style**: Minimal, clean layout
- **Content**: Logo, essential links (4-5 groups), social icons, legal links
- **Spacing**: Generous py-20, grid-cols-4 for link groups
- **Bottom Bar**: Copyright + terms in small text

## Responsive Behavior
- **Desktop (1024px+)**: Full multi-column layouts, side-by-side content
- **Tablet (768-1023px)**: 2-column grids, maintain rounded containers
- **Mobile (<768px)**: Single column, stack all elements, maintain 28px radius, reduce padding to p-6

## Critical Design Constraints
- Never compromise on white space - empty is better than cluttered
- Maintain 28px border radius on all major containers
- Keep navigation minimal and floating
- Use neon accent sparingly for maximum impact
- All interactive elements must have clear hover/active states
- Match reference screenshots precisely in landing page design