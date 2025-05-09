# React CRM Frontend

A modern, responsive frontend for a basic CRM (Customer Relationship Management) system. Built with React, Material UI, and Axios, this app allows admin users to manage customer records securely and efficiently.

## Features

- **Admin Authentication**: Secure login for admin users.
- **Customer Management**: Add, edit, delete, and search customers.
- **Pagination**: Efficiently browse large customer lists.
- **Responsive UI**: Clean, modern design using Material UI.
- **Notifications**: User feedback via snackbars and alerts.
- **Protected Routes**: Only authenticated users can access customer management.

## Tech Stack

- [React 19](https://react.dev/)
- [Material UI](https://mui.com/)
- [Axios](https://axios-http.com/)
- [React Router v7](https://reactrouter.com/)
- [notistack](https://iamhosseindhv.com/notistack)

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer)

### Installation
1. Clone the repository and navigate to the `frontend` folder:
   ```sh
   cd frontend
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

### Environment & API
- The frontend expects the backend API to be running at `https://localhost:7176` (see `src/index.js`).
- Update the `axios.defaults.baseURL` in `src/index.js` if your backend runs on a different URL.

## Usage
- **Login**: Use your admin credentials to log in.
- **Manage Customers**: Add, edit, delete, and search customers from the dashboard.
- **Logout**: Click the logout button in the top bar to end your session.

## Project Structure
```
frontend/
  public/
  src/
    pages/
      LoginPage.js
      CustomersPage.js
    App.js
    index.js
    ...
```

## Scripts
- `npm start` – Start the development server
- `npm run build` – Build for production
- `npm test` – Run tests

## License
This project is for educational/demo purposes.
