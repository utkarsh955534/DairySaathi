# 🐄 DairySaathi — Smart Dairy & Livestock Management System

A full-stack dairy farm management application built to help farmers manage livestock, milk production, animal health, breeding records, and daily farm activities from one centralized platform.

**Repository:** [DairySaathi on GitHub](https://github.com/utkarsh955534/DairySaathi)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database and Prisma Setup](#-database-and-prisma-setup)
- [API Documentation](#-api-documentation)
- [Authentication and Security](#-authentication-and-security)
- [Dashboard](#-dashboard)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📖 Overview

DairySaathi is a full-stack web application designed to simplify dairy farm management through digital record keeping.

Managing a dairy farm involves maintaining animal information, tracking daily milk production, recording vaccination and deworming activities, monitoring treatment history, and maintaining breeding records. Managing these activities manually can become difficult as the farm grows.

DairySaathi brings these operations into a centralized platform with a React-based frontend, a Node.js and Express backend, and a PostgreSQL database managed through Prisma ORM.

The application follows a modular backend architecture to keep authentication, livestock, milk, health, and breeding functionality organized and maintainable.

### Project Goals

- Digitize livestock records.
- Maintain animal-wise milk production history.
- Organize health records and follow-up dates.
- Maintain breeding and pregnancy-check histories.
- Display farm statistics through a dashboard.
- Provide authenticated access to farm data.
- Build a maintainable foundation for future dairy management features.

---

## ✨ Key Features

### 🔐 1. Authentication and User Management

- User registration.
- Email and password login.
- JWT-based authentication.
- Protected API routes.
- User profile retrieval and updates.
- Password change functionality.

The current documented authentication flow does not require OTP verification. Only the authentication routes available in the current backend should be used.

### 🐄 2. Livestock Management

- Create and maintain animal records.
- Assign animal names and identification tags.
- Store species, sex, and life-stage information where applicable.
- Maintain production and lactation status.
- Store pregnancy-related information.
- Track mother and father relationships.
- Associate calves with their parent animals.
- Retrieve, update, and delete animal records.

### 🥛 3. Milk Production Management

- Record milk production for individual animals.
- Store morning and evening milk quantities.
- Calculate total milk production.
- Retrieve historical milk records.
- Maintain records by animal and date.
- Summarize daily milk production across the farm.

### 🩺 4. Animal Health Management

Maintain health records for activities such as:

- Deworming.
- Vaccination.
- Treatment.
- Health checkups.
- Other health-related events.

Depending on the record type, health information can include record dates, vaccine or dewormer names, diagnosis, medicine, dosage, findings, notes, and follow-up dates.

### 🧬 5. Breeding Management

The breeding module supports the recording of:

- Heat observations.
- Insemination events.
- Pregnancy checks.
- Semen identification.
- Technician information.
- Pregnancy-check results.
- Breeding event dates and notes.

Pregnancy-check results can update the corresponding animal's pregnancy status.

### 📊 6. Dashboard Statistics

The dashboard summarizes farm information, including:

- Total registered livestock.
- Today's recorded milk production.
- Total health records.
- Upcoming eligible health tasks within the next seven days.

### 🕒 7. Recent Farm Activity

The recent activity component combines information from available farm records, such as:

- Milk records.
- Health records.
- Livestock registrations.
- Upcoming health tasks.

The current frontend implementation periodically fetches available API data to refresh the activity list.

### 📱 8. Responsive Interface

The frontend uses React and Tailwind CSS to build reusable components and responsive layouts for farm management pages, dashboard cards, and record views.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend application framework |
| React | Component-based user interface |
| Tailwind CSS | Responsive styling |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation where configured |
| Git and GitHub | Version control and source-code hosting |
| Thunder Client / Postman | API testing |

---

## 🏗️ Application Architecture

DairySaathi follows a client-server architecture.

```text
                 ┌─────────────────────┐
                 │        User         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Next.js / React     │
                 │ Frontend            │
                 └──────────┬──────────┘
                            │
                      HTTP Requests
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Express.js Backend   │
                 │                     │
                 │ Routes              │
                 │ Middleware          │
                 │ Controllers         │
                 │ Services            │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Prisma ORM          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ PostgreSQL          │
                 │ Database            │
                 └─────────────────────┘
```

### Backend Architecture

The backend uses a modular MVC-style structure.

- **Routes:** Define HTTP endpoints and middleware.
- **Middleware:** Handle authentication and other request-processing requirements.
- **Controllers:** Handle requests and responses.
- **Services:** Contain application business logic and database operations.
- **Prisma ORM:** Provides database access.
- **PostgreSQL:** Stores application data persistently.

This structure helps separate responsibilities and makes the application easier to maintain and extend.
---

## ⚙️ Getting Started

Follow these steps to run the application locally.

### Prerequisites

Install the following:

- Node.js and npm.
- PostgreSQL.
- Git.
- Visual Studio Code or another code editor.

### 1. Clone the Repository

```bash
git clone https://github.com/utkarsh955534/DairySaathi.git
cd DairySaathi
```

### 2. Install Backend Dependencies

Open a terminal in the backend directory:

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory. Configure the database connection, JWT secret, and any other environment variables required by the application.

See the [Environment Variables](#-environment-variables) section.

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure its connection string in `DATABASE_URL`.

The application must use a database that exists and is accessible to the backend.

### 5. Generate the Prisma Client

From the backend directory, run:

```bash
npx prisma generate
```

The Prisma Client must be generated using the schema and configuration included in the project.

### 6. Apply Database Migrations

Run:

```bash
npx prisma migrate deploy
```

This applies the pending migrations included in the repository to the configured database.

For a new development database, ensure that the required migrations are present before starting the application.

### 7. Start the Backend

Use the start script configured in `Backend/package.json`.

```bash
npm start
```

If the project uses a development script, start it with:

```bash
npm run dev
```

The local backend has been configured to run on port `8000` in the development setup.

### 8. Install Frontend Dependencies

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
npm install
```

### 9. Configure the Frontend API URL

Create a `.env.local` file in the frontend project directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 10. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed by Next.js, usually:

```text
http://localhost:3000
```

The frontend can now communicate with the locally running backend.

---

## 🔑 Environment Variables

Never commit real secrets or production credentials to GitHub.

### Backend Environment

The backend requires environment variables for its database connection and authentication configuration.

Example development configuration:

```env
PORT=8000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5433/dairydb?schema=public"
JWT_SECRET="replace-with-a-strong-random-secret"
NODE_ENV="development"
```

Replace the example database credentials with your own local PostgreSQL configuration.

Additional environment variables may be required depending on the current backend implementation.

### Frontend Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Environment Variable Reference

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing and verification secret |
| `NODE_ENV` | Application environment |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL |

**Security note:** Variables beginning with `NEXT_PUBLIC_` are exposed to the browser. Never place database credentials or JWT secrets in frontend environment variables.

---

## 🗄️ Database and Prisma Setup

DairySaathi uses PostgreSQL for persistent storage and Prisma ORM for database access.

### Prisma Configuration

The project uses a Prisma 7 configuration file, `prisma7.config.ts`, to define the schema location, migration directory, and database connection.

The schema uses the PostgreSQL provider, and the generated Prisma Client is configured for the backend's application code.

### Common Prisma Commands

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

Run these commands from the backend directory where the Prisma configuration is available.

### Database Relationships

The data model associates:

- Users with their animals.
- Animals with milk records.
- Animals with health records.
- Animals with breeding records.
- Parent animals with their offspring, where applicable.

These relationships support animal-wise record retrieval and farm data organization.

---

## 🌐 API Documentation

DairySaathi exposes REST API endpoints through its Express backend.

### Base URL

```text
http://localhost:8000/api/v1
```

The following endpoint paths are based on the route definitions and frontend integrations discussed for this project. Routes that could not be confirmed are not listed as guaranteed endpoints.

### 1. Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login/email` | Authenticate using email and password |
| GET | `/auth/me` | Retrieve the authenticated user's details |
| PUT | `/auth/profile` | Update the user profile |
| PUT | `/auth/change-password` | Change the account password |

The current documented authentication flow is OTP-free.

### 2. Animal Management APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/animals` | Create an animal record |
| GET | `/animals` | Retrieve the authenticated farmer's animals |
| GET | `/animals/:id` | Retrieve a specific animal |
| PUT | `/animals/:id` | Update an animal record |
| DELETE | `/animals/:id` | Delete an animal record |

The animal creation route supports a photo upload using multipart form data where configured.

### 3. Milk Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/milk/animals/:animalId` | Retrieve milk records for an animal |
| POST | `/milk/animals/:animalId` | Create a milk production record |

Milk records include a record date, morning and evening quantities, a total quantity, and optional notes according to the data model.

The database enforces uniqueness for the combination of animal and record date.

### 4. Animal Health APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health/animals/:animalId` | Retrieve an animal's health records |
| POST | `/health/animals/:animalId` | Create an animal health record |

Health records can store vaccination, deworming, treatment, checkup, and other health-related information.

Relevant fields can include record dates, vaccine or dewormer names, diagnosis, medicine, dosage, follow-up dates, findings, and notes.

### 5. Breeding Management APIs

The breeding service supports the following operations:

- Create heat-observation records.
- Create insemination records.
- Create pregnancy-check records.
- Retrieve an animal's breeding history.
- Update pregnancy status after a pregnancy check.

The exact HTTP paths and methods for breeding routes are not included here because their current route declarations have not been verified.

### 6. Other Animal Operations

The application also contains animal-related logic for calf records and parent relationships. The exact dedicated calf endpoint, if any, depends on the current route implementation.

### Authenticated Requests

Protected endpoints use a JWT access token in the authorization header.

Example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Never commit real tokens or credentials to source control.

### API Testing

The APIs can be tested using Thunder Client or Postman.

For protected requests:

1. Authenticate through the login endpoint.
2. Obtain the token from the successful response.
3. Add the token to the `Authorization` header.
4. Send requests to the required endpoint.
5. Check the response status and returned data.

---

## 🔒 Authentication and Security

The application uses JWT-based authentication and is designed to restrict access to authenticated users.

Security practices include:

- Password hashing with bcrypt.
- JWT-based authorization.
- Backend input validation where configured.
- User ownership checks for animal-related records.
- Environment variables for sensitive configuration.
- Database relationships and constraints.

Before public production deployment, ensure that:

- HTTPS is enabled.
- JWT secrets are strong and private.
- CORS allows only the intended frontend origins.
- Users cannot access another farmer's records.
- Uploads are validated and stored safely.
- Error responses do not expose secrets or sensitive implementation details.
- Database backups and access permissions are configured appropriately.

---

## 📊 Dashboard

The dashboard summarizes important farm information.

### Dashboard Statistics

The dashboard includes cards for:

- **Total Livestock:** Number of registered animals returned by the backend.
- **Today's Milk:** Total milk recorded for the current date.
- **Health Records:** Total health records retrieved for the farmer's animals.
- **Upcoming Tasks:** Eligible health follow-ups due within the next seven days.

### Recent Activity

The recent activity component fetches milk and health records along with animal information.

It can periodically refresh its data to display newly available records. This polling-based approach is not the same as instant push-based real-time communication.

---

## 🧪 Testing

Recommended test scenarios include:

- Register a user and verify the response.
- Log in using valid and invalid credentials.
- Request a protected resource without a token.
- Create and retrieve animal records.
- Update and delete animal records.
- Add and retrieve milk production records.
- Verify daily milk totals.
- Add health records and verify their retrieval.
- Test upcoming health follow-up dates.
- Record breeding events and pregnancy-check results.
- Verify that one farmer cannot access another farmer's records.
- Test invalid input and missing required fields.
- Confirm that records persist after restarting the application.

---

## ☁️ Deployment

DairySaathi can be deployed with separate hosting for the frontend, backend, and database.

A possible hosting arrangement is:

| Component | Suggested Provider |
|---|---|
| Next.js frontend | Vercel |
| Express backend | Render |
| PostgreSQL database | Neon |

These are deployment options, not a claim that the project is already live.

### Deployment Steps

1. Push the latest source code to GitHub.
2. Create a production PostgreSQL database.
3. Configure the production `DATABASE_URL`.
4. Configure the production `JWT_SECRET`.
5. Ensure Prisma Client generation runs during the backend build.
6. Apply pending migrations using `prisma migrate deploy`.
7. Deploy the Express backend.
8. Configure CORS for the frontend's production domain.
9. Set `NEXT_PUBLIC_API_URL` to the deployed backend API base URL.
10. Deploy the Next.js frontend.
11. Test authentication and all required API operations.
12. Verify database persistence and authorization.

For production, the frontend API variable should use the deployed backend URL rather than `localhost`.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Advanced milk production analytics.
- Feed recommendations based on animal characteristics.
- Scheduled breeding and pregnancy-diagnosis appointments.
- Automated reminders for vaccination and deworming.
- Calf growth and weight tracking.
- Pedigree visualization.
- Farm income and expense management.
- Downloadable farm reports.
- Persistent activity logs.
- Notifications for important farm events.
- Role-based access for farm workers.
- Automated tests and improved deployment monitoring.

These features can be introduced incrementally as the application develops.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your changes locally.
5. Commit with a descriptive message.
6. Open a pull request explaining the improvement.

Please do not commit credentials, private configuration files, or production database data.

---

## 📄 License

No specific open-source license is declared in this documentation. Reuse and redistribution should follow the license terms, if any, included in the repository.

---

## 👨‍💻 Author

**Utkarsh Mishra**

B.Tech — Computer Science and Engineering

GitHub: [utkarsh955534](https://github.com/utkarsh955534)

Project Repository: [DairySaathi](https://github.com/utkarsh955534/DairySaathi)

---

**DairySaathi — Bringing dairy farm management into one organized digital platform.**
