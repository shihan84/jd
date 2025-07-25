# Flussonic Client & Admin Dashboard

This project provides a web-based dashboard for clients to monitor their Flussonic stream's data usage, view a live preview, and manage restreaming. It also includes an admin panel to manage multiple Flussonic servers, create client accounts, and assign specific streams to them.

## Technology Stack

- **Backend:** Python (FastAPI)
- **Frontend:** Vue.js
- **Database:** MySQL/MariaDB
- **Deployment:** aaPanel

## Setup and Deployment on aaPanel

### 1. Prerequisites

- A server with aaPanel installed.
- A domain or subdomain pointed to your server's IP address.
- Flussonic Media Server installed and running.

### 2. Database Setup

1.  Log in to your aaPanel dashboard.
2.  Go to the **Databases** section and click **Add Database**.
3.  Create a new MySQL/MariaDB database. Note down the database name, username, and password.

### 3. Backend Setup

1.  Go to the **Website** section in aaPanel and click **Add Site**.
2.  Select **Python project** from the dropdown menu.
3.  Fill in your domain name.
4.  Set the project path to `/www/wwwroot/yourdomain.com`.
5.  Select the Python version (e.g., 3.10).
6.  Click **Submit**.

7.  Connect to your server via SSH or use the **Terminal** feature in aaPanel.
8.  Navigate to your project directory: `cd /www/wwwroot/yourdomain.com`
9.  Clone this repository into the directory.
10. Create a virtual environment: `python3 -m venv venv`
11. Activate the virtual environment: `source venv/bin/activate`
12. Install the required Python packages: `pip install -r backend/requirements.txt`
13. Create a `.env` file in the project root by copying `.env.example`.
14. Edit the `.env` file with your database credentials and a strong secret key.
    ```
    DATABASE_URL=mysql+mysqlconnector://your_db_user:your_db_password@127.0.0.1:3306/your_db_name
    SECRET_KEY=your_strong_secret_key
    ```
15. In the aaPanel **Website** settings for your project, set the entry point to `backend/main.py` and the startup module to `uvicorn`.

### 4. Frontend Setup

1.  Go to the **Website** section in aaPanel and click **Add Site**.
2.  Create a new site for your frontend (e.g., `dashboard.yourdomain.com`).
3.  Connect to your server via SSH or use the **Terminal** feature in aaPanel.
4.  Navigate to the `frontend` directory in your project.
5.  Install the required Javascript packages: `npm install`
6.  Build the frontend application: `npm run build`
7.  Copy the contents of the `frontend/dist` directory to the root of your frontend site (`/www/wwwroot/dashboard.yourdomain.com`).

### 5. Scheduled Task for Data Collection

1.  Go to the **Cron** section in aaPanel.
2.  Click **Add Cron Job**.
3.  Set the **Type of Task** to **Shell Script**.
4.  Set the **Name of Task** to "Flussonic Usage Collector".
5.  Set the **Period** to run as often as you need (e.g., every hour).
6.  In the **Script content** box, add the command to run the usage collector script:
    ```bash
    /www/wwwroot/yourdomain.com/venv/bin/python /www/wwwroot/yourdomain.com/backend/app/services/usage_collector.py
    ```
7.  Click **Add Task**.
