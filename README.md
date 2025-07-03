# Grocery Store Website

This is a simple Node.js full stack example using Express and EJS templates. The homepage displays a few random grocery products.

## Setup

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Before starting, copy the provided `.env.example` to `.env` and fill in the
environment variables. The `.env` file should **not** be committed to source
control. You may optionally create a `.env.local` for personal settings:

```bash
cp .env.example .env
cp .env .env.local  # optional local copy
```

Edit `.env` (or `.env.local`) and fill in the following values:

```ini
STRIPE_SECRET_KEY=your_stripe_secret_key
SESSION_SECRET=grocery-secret
```

The application will create a SQLite file `db.sqlite` to store user accounts on first run.

Visit `http://localhost:3000` in your browser.
