# FinanceVUE – Personal Finance Management System

FinanceVUE is a full-stack personal finance management system built using Spring Boot (Backend) and React (Frontend).  

The application allows users to securely manage income and expenses, track monthly budgets, import bulk transactions via Excel, export data as CSV, and automate monthly tracking using a Spring Boot Cron Scheduler.

This project demonstrates secure REST API development, JWT-based authentication, file processing, scheduled automation, and full-stack integration.

---

## Features

### Authentication and Security

- User Registration
- User Login
- JWT (JSON Web Token) based authentication
- Protected REST APIs using Spring Security
- Authorization header support (Bearer Token)

All secured endpoints require:

Authorization: Bearer <JWT_TOKEN>

---

### Finance Management

- Add income transactions
- Add expense transactions
- Update transactions
- Delete transactions
- Categorize transactions
- Monthly budget setup
- Budget usage monitoring

---

### Excel Import (Bulk Transaction Upload)

Users can upload an Excel (.xlsx) file to import multiple transactions at once.

Technology used:
- Apache POI

Expected Excel Format:

Date | Type | Category | Amount | Description
2026-01-10 | Expense | Food | 500 | Lunch
2026-01-11 | Income | Salary | 50000 | Monthly Salary

API Endpoint:

POST /api/transactions/import

- Accepts multipart Excel file
- Validates data
- Saves transactions to database

---

### CSV Export

Users can export their transaction history as a downloadable CSV file.

Technology used:
- OpenCSV

API Endpoint:

GET /api/transactions/export

- Dynamically generates CSV
- Returns downloadable file response

---

### Monthly Budget Tracking with Spring Cron Scheduler

The system uses Spring Boot's @Scheduled annotation to automate monthly and daily budget tracking.

Automated Tasks:

1. Monthly Summary Generation  
   - Runs on the first day of every month  
   - Calculates total expenses of previous month  
   - Stores monthly summary  
   - Resets monthly tracking counters  

2. Daily Budget Monitoring  
   - Runs daily (configurable cron expression)  
   - Compares total expenses with monthly budget  
   - Calculates budget usage percentage  
   - Flags warning and exceeded states  

Example Cron Configuration:

For monthly execution:

@Scheduled(cron = "0 0 0 1 * ?")

For daily execution:

@Scheduled(cron = "0 0 1 * * ?")

The scheduler ensures automated financial tracking without manual intervention.

---

## Technology Stack

Backend:
- Java 17+
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA
- Hibernate
- Apache POI
- OpenCSV
- Spring Scheduler
- Maven

Frontend:
- React.js
- JavaScript
- HTML5
- CSS3
- Axios

Database:
- MySQL or PostgreSQL

---

## Installation and Setup

### Prerequisites

- Java 17 or higher
- Node.js (v16 or higher)
- Maven
- MySQL or PostgreSQL
- Git

---

### Backend Setup

Clone the repository:

git clone https://github.com/Bhavish2005/Finance_SpringBoot.git  
cd Finance_SpringBoot/backend  

Configure database and JWT properties in:

src/main/resources/application.properties

Example configuration:

spring.datasource.url=jdbc:mysql://localhost:3306/finance_db  
spring.datasource.username=root  
spring.datasource.password=your_password  
spring.jpa.hibernate.ddl-auto=update  

jwt.secret=your_secret_key  
jwt.expiration=86400000  

Run backend:

mvn clean install  
mvn spring-boot:run  

Backend runs on:

http://localhost:8080  

---

### Frontend Setup

cd ../frontend  
npm install  
npm start  

Frontend runs on:

http://localhost:3000  

---

## API Endpoints Overview

Authentication:
POST /api/auth/register  
POST /api/auth/login  

Transactions:
GET /api/transactions  
POST /api/transactions  
PUT /api/transactions/{id}  
DELETE /api/transactions/{id}  

File Handling:
POST /api/transactions/import  
GET /api/transactions/export  

Dashboard:
GET /api/dashboard  

---

## Production Build

Backend:

mvn clean package  
java -jar target/finance-backend.jar  

Frontend:

npm run build  

---

## Future Improvements

- Role-based access control (Admin/User)
- Refresh token implementation
- Email notifications for budget alerts
- Docker deployment
- CI/CD pipeline integration
- Cloud deployment
- Advanced financial forecasting

---

## Author

Bhavish Pushkarna  
Full Stack Developer  

GitHub: https://github.com/Bhavish2005  

---
