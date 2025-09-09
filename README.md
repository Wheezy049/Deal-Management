# Vobb OS - Atlas Module: Deal Management Interface

A fully functional **deal management interface** for Vobb OS’s Atlas module. Agents can view, create, and manage deals using **Tabular View** or **Kanban View**, with features like drag-and-drop, customizable views, search/sort/filter, dark mode, and full mobile responsiveness.

---

## **Demo / Hosted Link**

[https://vobb-deal-management.vercel.app/](https://vobb-deal-management.vercel.app/)

---

## **Tech Stack**

- **Frontend:** React.js with TypeScript  
- **State Management:** Zustand  
- **Styling:** Tailwind CSS  
- **Testing:** Jest & React Testing Library  
- **API Simulation:** MockAPI (hosted online)

---

## **Features**

### Core Features

1. **Navigation**
    - Navbar with links: Deals, Settings, Profile.

2. **Deal List Views**
    - **Tabular View**
        - Columns: Client Name, Product Name, Deal Stage/Status, Created Date, Actions (View/Edit/Delete)
        - Toggle visibility of table columns (persist across reloads)
        - Search, sort, and filter functionality
    - **Kanban View**
        - Pipeline stages:
            - Lead Generated, Contacted, Application Submitted, Application Under Review, Deal Finalized, Payment Confirmed, Completed, Lost
        - Draggable deals between stages
        - Toggle visibility of metadata (persist across reloads)

3. **Deal Creation Modal**
    - Required fields: Product, Client, Assigned Stage (default: Lead Generated)
    - Validation for required fields
    - New deals appear instantly in the current view

4. **Responsive UI**
    - Fully mobile responsive
    - Desktop-ready layout

5. **Dynamic Updates**
    - Stage changes, edits, and deletions update views immediately
    - Column visibility and active view persist across reloads

6. **Dark Mode**
    - Toggle between light and dark themes

7. **State Management**
    - Zustand used to manage deals, current view, active deal, and user preferences

8. **API Simulation**
    - MockAPI for fetching, creating, updating, and deleting deals, products, and clients
    - Proper loading and error handling implemented

9. **Testing**
    - Unit and integration tests with Jest and React Testing Library

---

## **Setup Instructions**

1. **Clone the repository**
```bash
git clone https://github.com/Wheezy049/Vobb-Deal-Management
cd vobb-deal-management
```

## Install Dependencies
```bash
npm install
```

## Start the application
```bash
npm run dev   # using nodemon for development
```

## Run tests
```bash
npm test
```