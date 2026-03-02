#  FinanceVUE – AI Powered Personal Finance Manager

FinanceVUE is a full-stack personal finance management system built using **Spring Boot (Backend)** and **React (Frontend)**.  
It helps users intelligently track expenses, manage budgets, analyze financial health, and leverage AI-powered receipt scanning.

---

##  Project Overview

FinanceVUE allows users to:

- Track income and expenses
- Set monthly budgets
- Receive budget alerts
- View financial analytics dashboards
- Upload receipts for AI-based data extraction
- Monitor overall financial health score

This project demonstrates full-stack development including backend API design, database integration, authentication handling, and frontend UI implementation.

---


- **Backend:** Handles business logic, authentication, database operations, and API endpoints.
- **Frontend:** Communicates with backend APIs and provides interactive UI.
- **Database:** Stores user data, transactions, budgets, etc.
- **AI Layer:** Used for receipt scanning and financial insights (if configured).

---

##  Tech Stack

###  Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven

###  Frontend
- React.js
- JavaScript
- HTML5
- CSS3

###  Database
- MySQL / PostgreSQL (Configurable)

###  Tools
- Postman
- Git & GitHub
- VS Code / IntelliJ IDEA

---

##  Features

###  User Management
- User Registration
- Login Authentication
- Profile Management

###  Finance Management
- Add Income
- Add Expenses
- Categorize Transactions
- Monthly Budget Setting

###  Dashboard & Reports
- Expense Summary
- Income vs Expense Analysis
- Budget Tracking
- Financial Health Score

###  AI Features (Optional if configured)
- Smart Receipt Scanning
- Auto Expense Extraction
- Intelligent Spending Analysis

---

##  Installation & Setup

###  Prerequisites

Make sure you have installed:

- Java 17 or above
- Node.js (v16 or above)
- MySQL/PostgreSQL
- Maven
- Git

---

## 🔧 Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Bhavish2005/Finance_SpringBoot.git
cd Finance_SpringBoot/backend
```

2. Configure database in:

```
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

3. Build and run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

##  Frontend Setup

1. Navigate to frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

##  API Endpoints (Sample Structure)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login | Login user |
| GET    | /api/transactions | Get all transactions |
| POST   | /api/transactions | Add transaction |
| GET    | /api/dashboard | Fetch dashboard data |
| POST   | /api/receipt/upload | Upload receipt |



---


---

##  Environment Variables (Frontend)

Create a `.env` file inside frontend:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

##  Production Build

### Backend

```bash
mvn clean package
java -jar target/finance-backend.jar
```

### Frontend

```bash
npm run build
```

Deploy the `build/` folder using Nginx, Apache, or cloud hosting.

---

##  Testing

- Test APIs using Postman
- Use browser for GET endpoints
- Add unit tests using JUnit (recommended)

---

##  Future Improvements

- JWT Authentication
- Role-Based Access Control
- Docker Deployment
- CI/CD Pipeline Integration
- Cloud Deployment (AWS/GCP/Azure)
- Advanced AI-based financial forecasting

---

##  Author

Bhavish Pushkarna  
Full Stack Developer | ML Enthusiast | System Builder  

GitHub: https://github.com/Bhavish2005  

---


##  Support

If you like this project, consider giving it a ⭐ on GitHub!
