# FinanceVUE

**Full-Stack AI-Powered Personal Finance Management System**

> Built with Spring Boot + React. Track spending, scan receipts with AI, score your financial health, and get monthly reports — all in one place.

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.11-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

---

## What is FinanceVUE?

FinanceVUE is a production-grade personal finance platform where users can manage multiple bank accounts, track income and expenses, set monthly budgets, work toward savings goals, and get a calculated Financial Health Score based on their real data.

The standout feature is an **AI Receipt Scanner** — upload a photo of any receipt and Google Gemini automatically extracts the merchant, amount, date, and category, pre-filling a transaction form ready to save in one click.

Every month the system automatically emails users a full financial summary. Budget alerts fire at 80% and 100% so users know before they overspend. The entire app supports **dark mode** with a consistent design system across all 10 pages.

---

## Features at a Glance

| Feature | Description |
|---|---|
| JWT Authentication | Secure register/login with stateless token-based auth |
| Multi-Account Management | Savings, checking, credit cards, cash — with real-time balance updates |
| Transaction Engine | Full create/edit/delete with automatic balance correction on every change |
| AI Receipt Scanner | Snap a receipt → Gemini AI fills in the transaction details |
| Budget Tracking | Monthly per-category budgets with visual progress bars |
| Savings Goals | Set targets, contribute amounts, auto-completes when reached |
| Financial Health Score | 0–100 score with grade (A–F) based on savings, budgets, goals, net worth |
| Recurring Detection | Auto-flags transactions that repeat month over month |
| Monthly Email Reports | Automated HTML email summary every 1st of the month |
| CSV Import | Bulk import transactions with row-level error reporting |
| Dark Mode | Full dark/light theme across every page |

---

## Tech Stack

**Backend** — Java 21, Spring Boot 3.5.11, Spring Security, Spring Data JPA, PostgreSQL, JWT, JavaMailSender, OkHttp3

**Frontend** — React 18, Vite, Tailwind CSS v4, Recharts, React Icons

**AI** — Google Gemini 2.0 Flash API

---

## Prerequisites

Make sure you have these installed before running the project:

- [Java 21+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 16+](https://www.postgresql.org/download/)
- [Maven](https://maven.apache.org/) (or use the included `./mvnw` wrapper)
- A free [Google Gemini API Key](https://aistudio.google.com/apikey)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Bhavish2005/FinanceVUE.git
cd FinanceVUE
```

### 2. Create the PostgreSQL database
```bash
psql -U postgres -c "CREATE DATABASE financevue;"
```

### 3. Configure the backend

Open `backend/src/main/resources/application.yml` and fill in your values:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/financevue
    username: YOUR_POSTGRES_USERNAME
    password: YOUR_POSTGRES_PASSWORD
  mail:
    host: smtp.gmail.com
    port: 587
    username: YOUR_GMAIL_ADDRESS
    password: YOUR_GMAIL_APP_PASSWORD

app:
  jwt:
    secret: any-random-string-minimum-32-characters-long
  gemini:
    api-key: YOUR_GEMINI_API_KEY
```

### 4. Run the backend
```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`. All database tables are created automatically on first run.

### 5. Run the frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`. Open that URL in your browser and you're ready to go.

---

## Project Structure
```
FinanceVUE/
├── backend/                  # Spring Boot application
│   └── src/main/java/
│       ├── account/          # Account management + balance logic
│       ├── transaction/      # Transaction CRUD + CSV import + AI scanner
│       ├── budget/           # Budgets + email alerts
│       ├── goal/             # Savings goals + contributions
│       ├── common/           # Dashboard, Health Score, Email reports
│       ├── ai/               # Gemini receipt parsing service
│       └── security/         # JWT filter + configuration
│
└── frontend/                 # React + Vite application
    └── src/
        ├── pages/            # One file per page (Dashboard, Accounts, etc.)
        ├── components/       # Sidebar, Layout, shared UI
        ├── api/              # Axios API modules per resource
        └── context/          # Auth context, Theme context
```

---

## Pages
```
/                →  Landing page
/dashboard       →  Monthly summary, charts, recent transactions
/accounts        →  Manage bank accounts and balances
/transactions    →  Add, filter, search, and manage transactions
/budget          →  Set and track monthly spending budgets
/goals           →  Create savings goals and contribute to them
/recurring       →  View auto-detected recurring transactions
/health-score    →  Financial Health Score with grade and tips
/scan-receipt    →  AI receipt scanner
/import          →  Bulk CSV import
```

---

## For Recruiters

This project demonstrates end-to-end full-stack engineering across a non-trivial domain:

- **Backend design** — RESTful API with proper layering (Controller → Service → Repository), transaction consistency, and JWT security configured from scratch without shortcuts
- **Database modeling** — relational schema with foreign keys, JPA entity relationships, and queries that use server-side filtering and pagination rather than loading everything into memory
- **Third-party integration** — multipart file upload pipeline from React through Spring Boot to Google Gemini, with proper error handling and response parsing
- **Scheduled automation** — Spring `@Scheduled` cron job that runs monthly email reports for every user, with a manual trigger available from the dashboard
- **Frontend architecture** — 10-page React SPA with a custom design token system that makes dark mode a single prop on every component rather than duplicated class logic
- **Real engineering trade-offs** — atomic default account enforcement, row-level CSV import error isolation, balance reversal on transaction edit/delete

---

## License

MIT — free to use, fork, and build on.