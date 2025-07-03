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

Before starting, set environment variables for Stripe payments and sessions:

```bash
export STRIPE_SECRET_KEY=your_stripe_secret_key
export SESSION_SECRET=your_session_secret
```

The application will create a SQLite file `db.sqlite` to store user accounts on first run.

Visit `http://localhost:3000` in your browser.
