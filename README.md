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

Before starting, create a `.env` file in the project root. Place your Stripe
secret key in this file and set a session secret key. A template is provided and
already committed to the repository:

```bash
cp .env .env.local  # optionally create a local copy
```

Edit `.env` (or `.env.local`) and fill in the following values:

```ini
STRIPE_SECRET_KEY=your_stripe_secret_key
SESSION_SECRET=grocery-secret
```

The application will create a SQLite file `db.sqlite` to store user accounts on first run.

Visit `http://localhost:3000` in your browser.
