# MINTORAFI
## 🧩 Full Stack dApp – NFT Minting Platform

This is a full-stack decentralized application (dApp) designed for uploading files and minting NFTs.  
It is organized into three main folders:

- `frontend/` – React-based client with Tailwind and shadcn/ui
- `backend/` – Express backend handling uploads and minting logic
- `contracts/` – Solidity smart contracts for deployment

---

## 📁 Project Structure

```
root/
│
├── frontend/       # React-based UI
├── backend/        # Express backend with file/NFT logic
├── contracts/      # Solidity smart contracts
└── README.md
```

---

## 🧰 Tech Stack

- **Frontend**: React 19, TailwindCSS, shadcn/ui, TanStack Router, Lucide Icons
- **Backend**: Node.js, Express, Prisma, Hedera SDK
- **Blockchain**: Solidity, Hardhat-compatible setup
- **Utilities**: Ethers.js, Zod, Dotenv, Axios, Winston
- **Package Manager**: pnpm

---

## 📦 Frontend – [`frontend/package.json`](./frontend/package.json)

### 🔧 Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### 📚 Libraries Used

- React 19, TailwindCSS
- shadcn/ui + Radix UI components
- TanStack Query, Router, Table
- Axios, Sonner, Lucide Icons, Zod
- ESLint + Prettier config

---

## ⚙️ Backend – [`backend/package.json`](./backend/package.json)

### 🔧 Scripts

```json
{
  "dev": "nodemon src/server.ts",
  "start": "ts-node src/server.ts",
  "build": "tsc",
  "lint": "eslint ./src/**/*.ts",
  "lint:fix": "eslint ./src/**/*.ts --fix",
  "db:push": "prisma db push",
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
  "db:generate": "prisma generate",
  "db:reset": "prisma migrate reset --force",
  "db:studio": "prisma studio",
  "db:pull": "prisma db pull"
}
```

### 📚 Libraries Used

- Express, CORS, Cookie-Parser
- Prisma ORM
- Hedera SDK (`@hashgraph/sdk`)
- Nodemailer, Axios, Busboy
- Zod for validation
- Winston for logging

---

## 🧱 Smart Contracts – [`contracts/package.json`](./contracts/package.json)

### 🔧 Scripts

```json
{
  "contract:compile": "rm -rf build && solcjs --bin -o build contracts/nft.sol",
  "contract:deploy": "pnpm run contract:compile && tsx app.ts",
  "test": "tsx ./test/index.ts",
  "contract:livelogs": "tsx live-logs.ts"
}
```

### 📚 Libraries Used

- Solidity compiler (`solc`)
- Hedera SDK + Ethers.js
- dotenv, tsx
- OpenZeppelin contracts

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AryanThakur01/MintoraFi.git
cd MintoraFi
```

---

### 2. Install dependencies

Using [pnpm](https://pnpm.io/):

```bash
pnpm install -r
```

---

### 3. Run Backend

```bash
cd backend
pnpm dev
```

Make sure your `.env` and Prisma setup are configured correctly.

---

### 4. Run Frontend

```bash
cd frontend
pnpm dev
```

---

### 5. Compile & Deploy Contracts

```bash
cd contracts
pnpm contract:deploy
```

Update contract address in your frontend/backend configs if needed.

---

## 🔐 Environment Variables

Create `.env` files in both `frontend/`, `backend/`, and `contracts/` directories with appropriate values.

Examples:

```
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e...
DATABASE_URL=postgresql://...
```

---

## 🪪 License

This project is licensed under the **MIT License**.

---

## ✨ Credits

Built with ❤️ by Aryan Thakur
