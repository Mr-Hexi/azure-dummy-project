# Azure Deployment Guide: How to Host the Dummy Project

Now that we have successfully created a fresh, production-ready dummy project structure, here is a step-by-step walkthrough to get this project hosted live on Microsoft Azure. This setup accurately mocks the environment you will use for your actual **Auto Invest AI** web application.

---

## Prerequisites
Before beginning the Azure setup, you need to push this dummy project to a **GitHub repository**.
1. Create a new repository on GitHub (e.g., `azure-dummy-project`).
2. Run these commands inside the `azure-dummy-project` root directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Azure Dummy project"
   git branch -M main
   git remote add origin https://github.com/<your-username>/azure-dummy-project.git
   git push -u origin main
   ```

---

## Step 1: Deploying the Backend (Django API)

We will use **Azure App Service** to host the Python backend.

1. **Log in to the Azure Portal** (portal.azure.com).
2. Use the search bar to find and open **App Services**.
3. Click **+ Create** -> **Web App**.
4. **Basic Settings**:
   - **Subscription / Resource Group**: Create a new resource group named `DummyProject-RG`.
   - **Name**: Pick a unique name (e.g., `dummy-backend-api-123`).
   - **Publish**: Choose `Code`.
   - **Runtime stack**: Choose `Python 3.12` (or your preferred version).
   - **Operating System**: Choose `Linux`.
   - **Pricing Plan**: Choose `Free F1` or `Basic B1`.
5. Click **Next** to standard options until you reach the **Deployment** tab:
   - Choose **GitHub Actions** as your deployment method.
   - Authorize GitHub and select your repository & the `main` branch.
6. Click **Review + Create**, then **Create**. 

### Adding Backend Environment Variables
Once the resource is created, navigate to its dashboard.
1. On the left menu bar, find **Settings** -> **Environment variables**.
2. Add the following **App settings** (these override your [settings.py](file:///c:/Huzaifa/bizz_python/ML_PROJECTS_GITT/auto_invest_AI/backend/auto_invest/settings.py) local defaults):
   - `SECRET_KEY`: (e.g., `a1super-secret-production-key-999`)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-backend-app-name.azurewebsites.net` (no spaces or http prefixes)
   - `DATABASE_URL`: *(Leave empty for now until Step 3)*
3. **Save** and let the app restart.

---

## Step 2: Deploying the Frontend (React + Vite)

We will use **Azure Static Web Apps** for the frontend, which handles caching globally and comes with seamless GitHub Actions integration.

1. In the Azure portal, search for **Static Web Apps** and click **Create**.
2. **Basic Settings**:
   - **Resource Group**: Select the same `DummyProject-RG`.
   - **Name**: E.g., `dummy-frontend-ui-123`.
   - **Plan type**: Free.
3. **Deployment Details**:
   - Click **GitHub** and authorize.
   - Select your repository and `main` branch.
4. **Build Details** (Crucial Step):
   - **Build Presets**: Choose `Custom`.
   - **App location**: `/frontend` (Since your React code sits inside the `frontend` directory).
   - **Api location**: *(Leave blank)*.
   - **Output location**: `dist`.
5. Click **Review + Create**, then **Create**.

### Connecting the Frontend to the Backend
We need to tell the frontend where the newly deployed backend is located.
1. Open your deployed Static Web App dashboard.
2. Go to **Environment variables**.
3. Add a new variable: 
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-app-name.azurewebsites.net` *(The URL from Step 1)*.
4. **Save**. GitHub Actions will now automatically rebuild the frontend with the correct API link!

---

## Step 3: (Optional but Recommended) Setting Up PostgreSQL

Currently, your backend is using SQLite. To test persistent storage:
1. Search the portal for **Azure Database for PostgreSQL servers**.
2. Click **Create** -> **Flexible Server**.
3. Choose the same Resource Group, provide a server name, create an admin username and password.
4. Under **Networking**, enable `Allow public access to this server` so your App Service can connect.
5. Create the database.

Once deployed, copy your connection string and insert it into your App Service's **Environment variables** under the key `DATABASE_URL`.
```
postgres://<username>:<password>@<server-name>.postgres.database.azure.com:5432/<database_name>
```

---

## Verification
Navigate to your Frontend Static Web App URL. You should see a card stating: 
`Backend Response: Hello from Azure Dummy Backend!`

Once this succeeds, you will have completed a full end-to-end production pipeline test run. You can safely apply these exact same parameters and setups to the real `auto_invest_AI` project!
