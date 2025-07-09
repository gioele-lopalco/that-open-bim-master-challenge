# 🏗️ Construction Company Dashboard

A modern React application for construction project management, built with Vite, TypeScript, Firebase, and modern CSS.

## ✨ Features

- **Modern Dashboard**: Dark and professional interface with consistent design system
- **Project Management**: Full CRUD operations for projects with real-time updates
- **Todo Management**: Task system with search and filters
- **Intuitive Navigation**: Sidebar with main menu and active state
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **TypeScript**: Complete typing for enhanced safety
- **Performance**: Optimized build with Vite
- **Firebase Integration**: Real-time database with Firestore

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
- **Firebase** - Backend and database
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
│   ├── ProjectFormModal.tsx
│   ├── TodoCard.tsx
│   └── ViewerArea.tsx
├── classes/             # TypeScript classes and interfaces
│   └── Project.ts
├── firebase/           # Firebase configuration
│   └── index.ts
├── hooks/              # Custom hooks
│   └── useProjects.ts
├── utils/             # Utility functions
│   └── projectUtils.ts
├── styles/            # Global styles
│   ├── variables.css  # Design system
│   └── globals.css    # Base styles
└── App.tsx           # Main component
```

## 🔥 Firebase Setup

1. Create a `.env` file in the root directory
2. Add your Firebase configuration:
```env
VITE_API_KEY=your-api-key
VITE_AUTH_DOMAIN=your-auth-domain
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-storage-bucket
VITE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_APP_ID=your-app-id
```

## 🎯 Main Components

### Layout
Responsive grid layout with fixed sidebar and main area

### Project Management
- Create new projects with detailed information
- Edit existing project details
- Delete projects with confirmation
- Real-time updates with Firebase
- Progress tracking and status management

### Sidebar
- Company logo
- Navigation menu with icons
- Highlighted active state
- Responsive with mobile overlay

### Project Info Card
- Project avatar with initials
- Project details (Status, Cost, Role, Date)
- Animated progress bar
- Edit and delete functionality

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

# Create .env file and add Firebase config

# Start dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## 📦 3D Model Setup

To display the 3D model in the viewer, you need to add the model files to the `public` folder:

1. **Extract the files** from the provided ZIP file
2. **Copy the `Gear` folder** to the `public/` directory of the project
3. **Verify the file structure**:

```
public/
└── Gear/
    ├── Gear1.obj           # 3D model geometry
    ├── Gear1.mtl           # Model materials
    └── textures/           # Model textures
        ├── Gear_1_BaseColor.png
        ├── Gear_1_Normal.png
        ├── Gear_1_Metallic.png
        ├── Gear_1_Roughness.png
        └── ... (other textures)
```

4. **Restart the development server** if it was already running

**Note**: The 3D model files are not included in the Git repository due to size constraints. They must be added manually from the provided source.

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
