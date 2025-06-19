# Deployment and Execution Guide: crud-demo Application

## 1. Introduction

- Brief overview of the application
- Purpose of this guide

## 2. System Requirements

- Operating System:
  - Recommended: Windows 10 or later, macOS 10.15 or later, Ubuntu 20.04 or later
  - Minimum: Any OS that supports Node.js
- Hardware Requirements:
  - Memory: 4GB RAM
  - CPU: 2 cores
  - Disk Space: 500MB
- Software Requirements:
- Docker: (Needed for local Supabase setup)
  - Ensure Docker is installed and running on your system. You can download it from [https://www.docker.com/](https://www.docker.com/).
- Node.js: v20 (Recommended)
- npm: v10 (Recommended)

## 3. Dependency Installation

- **Node.js and npm:**
  - Install Node.js and npm from the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
- **Project Dependencies:**
  - Navigate to the project directory in your terminal.
  - Run the following command to install the project dependencies:
  ```bash
  npm install
  ```
  - The following dependencies will be installed:
  ```
  @emotion/react: ^11.14.0
  @emotion/styled: ^11.14.0
  @fontsource/roboto: ^5.2.6
  @mui/icons-material: ^7.1.1
  @mui/material: ^7.1.1
  @supabase/auth-helpers-nextjs: ^0.10.0
  @supabase/auth-ui-react: ^0.4.7
  @supabase/ssr: ^0.6.1
  dompurify: ^3.2.6
  next: 15.3.3
  react: ^19.0.0
  react-dom: ^19.0.0
  ```

## 4. Configuration

- **Environment Variables (`.env` file):**
  - Create a `.env` file in the root of the project directory.
  - Add the following environment variables to the `.env` file:
    ```
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    DATABASE_URI="YOUR_DATABASE_URI"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    ```
    - **Important:** Replace the placeholder values with your actual Supabase credentials. **Never commit your `.env` file to version control.**
- **Supabase Configuration:**
  - Access your Supabase project dashboard at [https://supabase.com/dashboard/project/cmqyyfiyfbvcrrrownei](https://supabase.com/dashboard/project/cmqyyfiyfbvcrrrownei).
  - Obtain your Supabase URL and anon key from your Supabase project dashboard under "Settings" -> "API".
  - Update the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in your `.env` file with your Supabase URL and anon key.
  - **Database Setup:**
  - The application uses a PostgreSQL database.
  - You can use the Supabase UI to manage your database.
  - The `DATABASE_URI` environment variable specifies the connection string for your database.

## 5. Execution

- **Installing the Supabase CLI:**
  - Install the Supabase CLI by following the instructions on the Supabase website: [https://supabase.com/docs/cli/getting-started](https://supabase.com/docs/cli/getting-started)
- **Starting the Supabase Server Locally:**
  - To start the Supabase server locally, run the following command:
    ```bash
    supabase start
    ```
  - This will start the Supabase server and create a local Supabase instance.
- **Serving the Edge Function:**
  - To serve the edge function, run the following command:
    ```bash
    supabase functions serve
    ```
- **Running the Application (Development):**
  - Run the following command to start the application in development mode:
  ```bash
  npm run dev
  ```
  - This will start a development server at `http://localhost:3000`.
- **Building the Application (Production):**
  - Run the following command to build the application for production:
  ```bash
  npm run build
  ```
  - This will create a `.next` directory containing the production build.
- **Running the Application (Production):**
  - Run the following command to start the application in production mode:
  ```bash
  npm run start
  ```

## 6. Troubleshooting

- **Common Errors and Solutions:**
  - **Error:** `Module not found: Can't resolve ...`
    - **Solution:** Make sure you have installed all the dependencies by running `npm install`.
  - **Error:** `Supabase connection error`
    - **Solution:** Make sure your Supabase URL and anon key are correct in the `.env` file. Also, ensure your Supabase database is running.
- **Debugging Tips:**
  - Use the browser's developer tools to debug the application.
  - Check the server-side logs for any errors.

## 7. Verification

- **Testing the Application:**
  - Run the following command to run the tests:
  ```bash
  npm run test
  ```
  - This will run the Jest test suite.
- **Validating Functionality:**
  - Manually test the application to ensure that all features are working as expected.
  - Check that you can create, read, update, and delete notes.
  - Verify that the authentication is working correctly.

## 8. Conclusion
