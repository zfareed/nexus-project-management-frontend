# Nexus Project Management - Frontend

A modern project management application frontend built with Next.js 16, React 19, and TailwindCSS 4 and daisyUI 5.  
This application serves as the user interface for the Nexus Project Management system, featuring a dynamic dashboard, task management, and project tracking.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/zfareed/nexus-project-management-frontend
    cd nexus-project-management-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Configuration

This project requires environment variables to connect to the backend API.

1.  Create a `.env` file in the root directory (you can copy `.env.example`).
2.  Define the backend URL:

    ```env
    # .env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
    ```
### Running the Application

Start the development server:

```bash
npm run dev
```

The application will start on **port 3001**.  
Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.


## 🛠️ Built With

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **HTTP Client:** Axios
- **Charts:** Recharts