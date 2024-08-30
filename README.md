## Bridge Checker

### To run

#### Step 1

- Install dependencies: `npm ci`
- Copy `.env.local.example` to `.env.local` in both workspaces
- Fill in necessary environment variables

#### Step 2

- Run DB migration: `npm run migrate -w backend`
- Import NBI data: `npm run import -w backend -- <path-to-NBI-file>`
- Generate types: `npm run kysely-codegen -w backend`

#### Step 3

- Development Mode: `npm run start`

### Credit
Project template from https://github.com/dstamenkovic/react-express-starter/tree/main
