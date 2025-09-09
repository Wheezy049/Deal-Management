# Vobb OS - Atlas Module: Deal Management Interface

## **Tech Stack**

- **Frontend:** React.js (Vite/Next.js/CRA)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Testing:** Jest & React Testing Library
- **API Simulation:** MockAPI (hosted online)

---

## **Design Decisions & Trade-offs**

- **Zustand** was chosen for lightweight state management over Redux for simplicity and minimal boilerplate.
- **Tailwind CSS** allows rapid styling with utility classes for responsive design.
- Kanban and Tabular views share common deal components to avoid repetition.
- MockAPI was chosen over `json-server` to allow deployment without needing a local backend.
- Column visibility toggles and active view state **persist across page reloads**, giving users a consistent experience.
- Preferences for metadata and columns persist in memory for additional flexibility.

---

## **Known Limitations / Areas for Improvement**

- Authentication/login flow is not implemented.
- Accessibility could be improved (aria tags, keyboard navigation).

---

## **Bonus Features Implemented**

- Persistent session-based view preferences (toggle columns/metadata visibility)
- Table search, sort, and filter functionality
- Fully mobile responsive UI
- Dark mode toggle

**Not implemented:**  
- Authentication mock (login/logout flow)

---

## **Conclusion**

The project meets all core functional requirements:  
- Dual Tabular & Kanban views  
- Dynamic deal creation, editing, and deletion  
- Drag-and-drop Kanban board  
- State management and API simulation  
- Column/metadata toggle persistence  
- Testing coverage for components and integration  
- Bonus features (search/sort/filter, mobile responsiveness, dark mode) implemented
