# Not in this economy

> Find the best deals because your wallet said no.

A sarcastic Gen-Z price comparison app that searches Google Shopping for the cheapest deals and lets you organize your "totally necessary" purchases into shopping lists.

## Features

- **Google Shopping Search** — powered by Serper.dev, searches across thousands of stores in one query
- **Shopping Lists** — create lists, add items, track what you've bought
- **Price Checking** — automatically finds the best price for every item on your list
- **User Accounts** — JWT authentication so your lists stay private
- **Mobile Responsive** — bottom tab bar, swipe-friendly cards, works on any device
- **Caching** — smart 6-hour search cache so you don't burn through API credits

## Tech Stack

| Layer      | Tech                                    |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 14, React 18, Tailwind CSS     |
| Backend    | Express.js, Node.js                     |
| Database   | MySQL (Railway)                         |
| Auth       | JWT + bcrypt                            |
| Search API | Serper.dev (Google Shopping)             |
| Hosting    | Single server on port 3400              |

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+ (or a Railway database)

### Setup

```bash
# Clone the repo
git clone https://github.com/QBH21/Not-in-this-economy.git
cd Not-in-this-economy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Set up the database (local MySQL)
npm run db:setup

# Start the dev server
npm run dev
```

The app runs on **http://localhost:3400** — both frontend and API on the same port.

### Environment Variables

| Variable           | Description                                    |
| ------------------ | ---------------------------------------------- |
| `PORT`             | Server port (default: 3400)                    |
| `DB_HOST`          | MySQL host                                     |
| `DB_PORT`          | MySQL port (default: 3306)                     |
| `DB_USER`          | MySQL username                                 |
| `DB_PASSWORD`      | MySQL password                                 |
| `DB_NAME`          | Database name                                  |
| `MYSQL_PUBLIC_URL` | Full MySQL connection URL (overrides above)     |
| `JWT_SECRET`       | Secret key for JWT tokens                      |
| `SERPER_API_KEY`   | API key from [serper.dev](https://serper.dev)  |
| `SEARCH_CACHE_TTL` | Search cache duration in seconds (default: 6h) |
| `PRICE_CACHE_TTL`  | Price cache duration in seconds (default: 2h)  |

## API Endpoints

### Auth
| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Create account       |
| POST   | `/api/auth/login`    | Log in               |
| GET    | `/api/auth/me`       | Get current user     |

### Shopping Lists (requires auth)
| Method | Endpoint                          | Description         |
| ------ | --------------------------------- | ------------------- |
| GET    | `/api/lists`                      | Get your lists      |
| POST   | `/api/lists`                      | Create a list       |
| GET    | `/api/lists/:id`                  | Get list + items    |
| PUT    | `/api/lists/:id`                  | Rename a list       |
| DELETE | `/api/lists/:id`                  | Delete a list       |
| POST   | `/api/lists/:id/items`            | Add item to list    |
| PUT    | `/api/lists/:id/items/:itemId`    | Update an item      |
| DELETE | `/api/lists/:id/items/:itemId`    | Delete an item      |

### Search (public)
| Method | Endpoint       | Description                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/api/search`  | Search Google Shopping       |

### Prices
| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/api/prices/:productId`         | Get prices for a product |
| POST   | `/api/prices/check-list/:listId` | Check prices for a list  |

## Project Structure

```
.
├── app/                  # Next.js pages
│   ├── page.tsx          # Homepage
│   ├── deals/page.tsx    # Search & results
│   ├── list/page.tsx     # Shopping lists
│   ├── login/page.tsx    # Login
│   └── signup/page.tsx   # Sign up
├── components/           # React components
├── lib/                  # API client & auth context
├── server/               # Express backend
│   ├── src/
│   │   ├── config/       # Database & env config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth, validation, rate limiting
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Serper API, price aggregation
│   │   └── utils/        # Logger
│   └── database/         # SQL schema
├── server.mjs            # Unified server entry point
└── package.json
```

## Authors

Built by **Amna & Maham**
