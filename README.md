# 🏗️ Construction Company Dashboard

A modern React application for construction project management, built with Vite, TypeScript, and modern CSS.

## ✨ Features

- **Modern Dashboard**: Dark and professional interface with consistent design system
- **Project Management**: Project details visualization with progress tracking
- **Todo Management**: Task system with search and filters
- **Intuitive Navigation**: Sidebar with main menu and active state
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **TypeScript**: Complete typing for enhanced safety
- **Performance**: Optimized build with Vite

## 🎨 Design Features

- **Color Scheme**: Professional dark blue palette
- **Typography**: Inter font from Google Fonts
- **Icons**: Material Symbols Outlined
- **Layout**: Modern CSS Grid with fixed sidebar
- **Animations**: Smooth transitions and hover effects
- **Components**: Modular and reusable architecture

## 🚀 Technologies Used

- **React 18** - Modern UI library
- **TypeScript** - Static typing
- **Vite** - Fast build tool
- **CSS Variables** - Scalable design system
- **CSS Grid & Flexbox** - Responsive layout
- **Google Fonts** - Professional typography
- **Material Icons** - Consistent iconography

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable components
│   │   ├── Avatar.tsx
│   │   └── ProgressBar.tsx
│   ├── Layout.tsx       # Main layout
│   ├── Sidebar.tsx      # Side navigation
│   ├── ProjectInfoCard.tsx
│   ├── TodoCard.tsx
│   └── ViewerArea.tsx
├── types/               # TypeScript definitions
│   └── Project.ts
├── hooks/               # Custom hooks
│   └── useProjects.ts
├── styles/              # Global styles
│   ├── variables.css    # Design system
│   └── globals.css      # Base styles
└── App.tsx             # Main component
```

## 🎯 Main Components

### Layout
Responsive grid layout with fixed sidebar and main area

### Sidebar
- Company logo
- Navigation menu with icons
- Highlighted active state
- Responsive with mobile overlay

### Project Info Card
- Project avatar with initials
- Project details (Status, Cost, Role, Date)
- Animated progress bar
- Functional edit button

### Todo Card
- Header with search and add button
- Task list with Material icons
- Real-time search filter
- Hover effects and transitions

### Viewer Area


## 💡 Interactive Features

- **Navigation**: Click on sidebar menu items
- **Todo Search**: Real-time task filtering
- **Add Todo**: Add new tasks with timestamp
- **Edit Project**: Progress increment on click
- **Responsive**: Collapsible sidebar on mobile

## 🎨 Design System

### Colors
- Primary: `#029AE0` (Main blue)
- Background: `#202124` (Dark background)
- Success: `#2ecc40` (Progress green)
- Warning: `#ca8134` (Avatar orange)

### Spacing
- System based on 4px multiples
- From `--spacing-xs` (4px) to `--spacing-4xl` (40px)

### Typography
- Font family: Inter
- Scale from 10px to 22px
- Weights: 400, 500, 600, 700

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Complete layout)
- **Tablet**: 768-1024px (Reduced sidebar)
- **Mobile**: < 768px (Sidebar overlay)

## 🏗️ CSS Structure

The project uses a modular CSS approach with:
- **CSS Variables** for the design system
- **BEM naming** for components
- **CSS Grid** for main layouts
- **Flexbox** for internal alignments
- **Media queries** for responsiveness
