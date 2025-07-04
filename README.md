# 🚀 That Open BIM Master Challenge - Creating Interactive Websites

## 📋 Description

A React + TypeScript application for managing projects and ToDos with a modern interface, dynamic colors, and data persistence. Developed following the Implementation Plan (PDR) of the master challenge.

## ✨ Implemented Features

### 🏗️ Project Management
- ✅ **Dynamic icons**: Each project shows an icon with the first 2 letters of the name (uppercase)
- ✅ **Random colors**: Background colors randomly assigned from a palette of 6 colors
- ✅ **Validation**: Project name must be at least 5 characters long
- ✅ **Default date**: Today's date if not specified
- ✅ **Edit projects**: Detail page to modify name, date, and description
- ✅ **Statistics**: Completed ToDos counter for each project

### 📝 ToDo Management
- ✅ **Create ToDos**: Add ToDos within each project
- ✅ **Dynamic states**: todo, in-progress, done
- ✅ **State colors**:
  - 🔵 Todo: light gray
  - 🟡 In Progress: yellow
  - 🟢 Done: green
- ✅ **Quick status change**: Click to change status
- ✅ **Edit/Delete**: Complete ToDo management

### 💾 Persistence and Import/Export
- ✅ **localStorage**: Automatic data saving
- ✅ **JSON export**: Export individual projects or all together
- ✅ **Import**: Load projects from JSON files
- ✅ **Duplicate handling**: Updates existing projects during import
- ✅ **Import flag**: Distinguishes imported projects

### 🎨 UI/UX
- ✅ **Responsive design**: Optimized for desktop and mobile
- ✅ **Modern interface**: SCSS styles with reusable components
- ✅ **Navigation**: React Router for page navigation
- ✅ **Filters**: Filter ToDos by status
- ✅ **Progress bar**: Project progress visualization
- ✅ **Modals**: Forms for creating/editing projects and ToDos

## 🛠️ Technologies Used

- **Vite**: Fast build tool
- **React 18**: UI library
- **TypeScript**: Static typing
- **React Router**: SPA navigation
- **SCSS**: Advanced styling
- **UUID**: Unique ID generation
- **localStorage**: Local data persistence

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProjectCard.tsx  # Project card with icon and colors
│   ├── ProjectForm.tsx  # Project creation/editing form
│   ├── ToDoItem.tsx     # ToDo item with dynamic colors
│   └── ToDoForm.tsx     # ToDo creation/editing form
├── pages/               # Main pages
│   ├── ProjectsPage.tsx    # Project list and management
│   └── ProjectDetailsPage.tsx # Project details and ToDos
├── models/              # TypeScript models
│   ├── Project.ts       # Project interface and utilities
│   └── ToDo.ts          # ToDo interface and types
├── utils/               # Utilities
│   ├── validation.ts    # Validation functions
│   ├── storage.ts       # localStorage/JSON management
│   └── colorUtils.ts    # Color utilities
├── App.tsx              # Main app with routing
├── App.scss             # Global styles
└── main.tsx             # Entry point
```

## 🚀 How to Use

### Installation
```bash
npm install
npm run dev
```

### Main Features

1. **Create a new project**:
   - Click "➕ New Project"
   - Enter name (min. 5 characters)
   - Add description (optional)
   - Set due date (optional)

2. **Manage ToDos**:
   - Click on a project to open details
   - Add ToDos with "➕ New ToDo"
   - Click status icon to change: ⭕ → 🔄 → ✅

3. **Export/Import**:
   - Export all projects or individual project
   - Import JSON files to restore data

### Usage Examples

**Portfolio Project**:
- Name: "Personal Portfolio"
- Icon: "PE"
- ToDos: "Create layout", "Add projects", "Deploy online"

**Mobile App Project**:
- Name: "E-commerce Mobile App"
- Icon: "EC"
- ToDos: "UI Design", "API Integration", "Testing"

## 🎨 Design Features

- **Color palette**: 6 professional colors for projects
- **Typography**: System fonts for optimal readability
- **Spacing**: Consistent 8px grid
- **Elevation**: Box shadows for depth
- **Micro-interactions**: Smooth hover and transitions
- **Responsive**: Mobile breakpoint at 768px

## 📊 Statistics and Metrics

- Progress bar with completion percentage
- ToDo counters by status (todo/in-progress/done)
- Project overview on homepage
- Advanced filters for ToDo status

## 🔄 Future Updates

Possible improvements:
- [ ] Drag & drop to reorder ToDos
- [ ] Advanced date picker with reminders
- [ ] Customizable themes
- [ ] Multi-user collaboration
- [ ] Cloud synchronization
- [ ] Advanced statistics and charts

## 🤝 Contributing

The project follows best practices for:
- React componentization
- TypeScript typing
- Modular architecture
- Organized SCSS styling
- Local state management

---

**Developed for the That Open BIM Master Challenge** 🏆

*A complete project demonstrating skills in React, TypeScript, UI/UX design, and modern frontend architecture.*
