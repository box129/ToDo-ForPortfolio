# 📝 React TypeScript ToDo App (Drag-and-Drop Enabled)

## 🌟 Overview

This is a modern ToDo list application built with **React** and **TypeScript**. It utilizes the `useReducer` hook for efficient state management and the **Dnd-kit** library to enable advanced drag-and-drop functionality for both reordering tasks and moving them between "Active" and "Completed" lists.

The user interface (UI) and user experience (UX) are designed following **Mobile-First** and **WCAG** accessibility standards, ensuring clarity, smooth visual feedback during drag operations, and accessible touch targets on all devices.

---

## ✨ Features

* **CRUD Operations:** Create, Read, Update (Edit), and Delete tasks.
* **Toggle Status:** Easily mark tasks as completed/uncompleted.
* **Drag-and-Drop Sorting:** Reorder tasks within the Active List using Dnd-kit's sorting capabilities.
* **Drag-and-Drop Status Change:** Drag tasks from the **Active List** onto the **Completed List** container to mark them as done.
* **Responsive Design:** The layout adjusts seamlessly from mobile screens to large desktops using fluid grids and media queries.

---

## 🛠️ Tech Stack

* **Framework:** React (Functional Components, Hooks)
* **Language:** TypeScript
* **State Management:** React's built-in `useReducer` Hook
* **Drag and Drop:** `@dnd-kit/core` and `@dnd-kit/sortable`
* **Styling:** Pure Custom CSS
* **Icons:** `react-icons`

---

## 🚀 Getting Started

Follow these steps to get a copy of the project running on your local machine.

### Prerequisites

You need to have **Node.js** and **npm** (or yarn/pnpm) installed.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [Your Repository URL]
    cd [Your Project Folder Name]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```

The application should now be accessible in your browser at `http://localhost:5173` (or the address shown in your terminal).

---

## 🎨 UI/UX Design Decisions

The application adheres to modern design principles, focusing on ease of use and accessibility:

* **Mobile-First Approach:** The UI is inherently responsive, ensuring critical content is prioritized and accessible on the smallest screens before adding complex layouts for desktop.
* **Visual Feedback:** When dragging an item, it gains a subtle **`box-shadow`** and reduced **`opacity`** (the "lifted" state). When dragging over a valid drop zone (like the Completed List), the container highlights to confirm the target action.
* **WCAG Compliance:** All interactive elements, including action icons (Edit, Delete, Done), are styled with generous padding to ensure they meet the minimum **44x44 pixel** accessible touch target size.
* **Form Reliability:** The drag listeners are intentionally separated from the native `<form>` element to ensure reliable form submission when pressing **Enter** in the edit input field.