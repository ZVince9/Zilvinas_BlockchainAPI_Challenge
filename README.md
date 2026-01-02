# Zilvinas_BlockchainAPI_Challenge

This is API automation coverage for some api endpoints

# Project Overview

- Schemas: Response validation is handled by Zod schemas to ensure the API matches the expected contract.
- Negative Testing: Includes tests for invalid token addresses, unsupported chains, and unrealistic amounts.
- Reporting: Uses the default Playwright HTML reporter for detailed failure analysis and trace viewing.

---

## 🛠 Tech Stack

- **E2E Framework:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **API Validation:** [Zod](https://zod.dev/) (Schema-first contract testing)

---

## 📋 Prerequisites

- **Node.js:** v18.0.0 or higher
- **Environment Variables:** Access to a `.env` file (see below).

---

## ⚙️ Setup & Configuration

### 1. Environment Variables

Create a `.env` file in the root directory and define the following:

```env
# API Configuration
BASE_URL="[https://li.quest](https://li.quest)"
ROUTES_URL="/v1/advanced/routes"
QUOTE_URL="/v1/quote"
TOOLS_URL="/v1/tools"

(optional)
LIFI_API_KEY="your_api_key_optional"
```

### 2. Instalation

```
npm install
npx playwright install
```

### 3. Run tests

- npm run api:TC (TC === quote, routes, tools) -> it runs based on specific tests
- npx playwright test -> will run all together
