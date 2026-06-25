# Pockettrack Project Structure

```text
Pockettrack/
├── .gitignore
├── PROJECT_FEATURES_AND_ARCHITECTURE.md
├── PROJECT_STRUCTURE.md
├── README.md
├── hs_err_pid15884.log
├── backend/
│   ├── .idea/
│   │   ├── .gitignore
│   │   ├── backend.iml
│   │   ├── compiler.xml
│   │   ├── encodings.xml
│   │   ├── jarRepositories.xml
│   │   ├── misc.xml
│   │   ├── modules.xml
│   │   ├── vcs.xml
│   │   └── workspace.xml
│   ├── backend/
│   │   ├── .gitattributes
│   │   ├── .gitignore
│   │   ├── .mvn/
│   │   │   └── wrapper/
│   │   │       └── maven-wrapper.properties
│   │   ├── HELP.md
│   │   ├── hs_err_pid17116.log
│   │   ├── hs_err_pid18932.log
│   │   ├── hs_err_pid23836.log
│   │   ├── hs_err_pid25828.log
│   │   ├── mvnw
│   │   ├── mvnw.cmd
│   │   ├── pom.xml
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/
│   │       │   │   └── com/
│   │       │   │       └── pockettrack/
│   │       │   │           └── backend/
│   │       │   │               ├── BackendApplication.java
│   │       │   │               ├── account/
│   │       │   │               │   ├── Account.java
│   │       │   │               │   ├── AccountAnalyticsService.java
│   │       │   │               │   ├── AccountController.java
│   │       │   │               │   ├── AccountRepository.java
│   │       │   │               │   ├── AccountRequest.java
│   │       │   │               │   └── AccountService.java
│   │       │   │               ├── ai/
│   │       │   │               │   ├── AiChatService.java
│   │       │   │               │   ├── ChatController.java
│   │       │   │               │   ├── GeminiService.java
│   │       │   │               │   └── RateLimitingInterceptor.java
│   │       │   │               ├── auth/
│   │       │   │               │   ├── AuthController.java
│   │       │   │               │   ├── JwtAuthFilter.java
│   │       │   │               │   └── JwtUtil.java
│   │       │   │               ├── budget/
│   │       │   │               │   ├── Budget.java
│   │       │   │               │   ├── BudgetAlertService.java
│   │       │   │               │   ├── BudgetBadge.java
│   │       │   │               │   ├── BudgetBadgeRepository.java
│   │       │   │               │   ├── BudgetController.java
│   │       │   │               │   ├── BudgetRepository.java
│   │       │   │               │   ├── BudgetRequest.java
│   │       │   │               │   └── BudgetService.java
│   │       │   │               ├── common/
│   │       │   │               │   ├── BudgetRolloverEngine.java
│   │       │   │               │   ├── DashboardController.java
│   │       │   │               │   ├── EmailService.java
│   │       │   │               │   ├── GlobalExceptionHandler.java
│   │       │   │               │   ├── HealthScoreController.java
│   │       │   │               │   ├── MonthlyReportService.java
│   │       │   │               │   ├── RecurringTransactionEngine.java
│   │       │   │               │   ├── SecurityConfig.java
│   │       │   │               │   └── SubscriptionSentinelEngine.java
│   │       │   │               ├── config/
│   │       │   │               │   ├── Bucket4jConfig.java
│   │       │   │               │   ├── RedisConfig.java
│   │       │   │               │   ├── WebMvcConfig.java
│   │       │   │               │   └── WebSocketConfig.java
│   │       │   │               ├── dashboard/
│   │       │   │               │   ├── PredictiveEngineService.java
│   │       │   │               │   ├── SubscriptionAnomaly.java
│   │       │   │               │   └── SubscriptionAnomalyRepository.java
│   │       │   │               ├── event/
│   │       │   │               │   ├── DebtSimplificationService.java
│   │       │   │               │   ├── Event.java
│   │       │   │               │   ├── EventController.java
│   │       │   │               │   ├── EventExpenseService.java
│   │       │   │               │   ├── EventInvite.java
│   │       │   │               │   ├── EventInviteRepository.java
│   │       │   │               │   ├── EventRepository.java
│   │       │   │               │   ├── ExpenseSplit.java
│   │       │   │               │   ├── ExpenseSplitRepository.java
│   │       │   │               │   ├── Settlement.java
│   │       │   │               │   ├── SettlementRepository.java
│   │       │   │               │   ├── SharedExpense.java
│   │       │   │               │   ├── SharedExpenseRepository.java
│   │       │   │               │   └── dto/
│   │       │   │               │       ├── DebtSummary.java
│   │       │   │               │       └── ExpenseRequest.java
│   │       │   │               ├── goal/
│   │       │   │               │   ├── Goal.java
│   │       │   │               │   ├── GoalController.java
│   │       │   │               │   ├── GoalRepository.java
│   │       │   │               │   ├── GoalRequest.java
│   │       │   │               │   └── GoalService.java
│   │       │   │               ├── transaction/
│   │       │   │               │   ├── Transaction.java
│   │       │   │               │   ├── TransactionController.java
│   │       │   │               │   ├── TransactionRepository.java
│   │       │   │               │   ├── TransactionRequest.java
│   │       │   │               │   └── TransactionService.java
│   │       │   │               └── user/
│   │       │   │                   ├── User.java
│   │       │   │                   └── UserRepository.java
│   │       │   └── resources/
│   │       │       ├── application.yml
│   │       │       ├── static/
│   │       │       └── templates/
│   │       └── test/
│   │           └── java/
│   │               └── com/
│   │                   └── pockettrack/
│   │                       └── backend/
│   │                           └── BackendApplicationTests.java
│   ├── hs_err_pid12352.log
│   ├── hs_err_pid15216.log
│   ├── hs_err_pid22436.log
│   ├── hs_err_pid25164.log
│   ├── hs_err_pid26376.log
│   ├── hs_err_pid2668.log
│   └── replay_pid12352.log
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── LandingPage.module.css
│       ├── assets/
│       │   └── Logo.svg
│       ├── api/
│       │   ├── accountApi.js
│       │   ├── authApi.js
│       │   ├── axiosConfig.js
│       │   ├── eventApi.js
│       │   └── transactionApi.js
│       ├── components/
│       │   ├── layout/
│       │   │   └── Layout.jsx
│       │   └── ui/
│       │       ├── AiChatWidget.jsx
│       │       ├── DashboardBadgesWidget.jsx
│       │       ├── SafeToSpendWidget.jsx
│       │       └── SubscriptionAlertWidget.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       ├── hooks/
│       │   └── useWebSocket.js
│       ├── index.css
│       ├── main.jsx
│       ├── pages/
│       │   ├── AccountAnanlyticsPage.jsx
│       │   ├── AccountsPage.jsx
│       │   ├── BudgetPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── EventsDashboardPage.jsx
│       │   ├── EventSettlementPage.jsx
│       │   ├── GoalsPage.jsx
│       │   ├── HealthScorePage.jsx
│       │   ├── ImportTransactionsPage.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── ReceiptScannerPage.jsx
│       │   ├── RecurringPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── SavingsHubPage.jsx
│       │   └── TransactionsPage.jsx
│       └── utils/
│           └── cn.jsx
└── target/
    └── generated-sources/
        └── annotations/
```

## Notes

- Build outputs and crash logs are included because they exist in the workspace, but the main source tree is under `backend/backend/src` and `frontend/src`.
- The backend follows a feature-based package layout by domain.
- The frontend follows a page/component/api/context split inside `src/`.
