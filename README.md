# stamp-service
React (TypeScript) app which enables users to look up Finnish stamps with search words using different search categories. Users can also filter their search according to launch year.

This is a school learning project with focus on integrating API to client, and using MySQL as database provider with Prisma ORM. Basic appearance with MUI. Note: app works in Finnish.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Step 1: Database Setup

Use the included dump-file 'postimerkkikanta.sql' to set up database.

### Step 2: Installation

Install both root and client dependencies with npm install. Make sure that you have Prisma-compatible Node version.

### Step 3: Set up Prisma

Initialize Prisma with 'npx prisma init'. Change datasource provider in schema.prisma -file to match your chosen provider.

### Step 4: Set up .env

Set up a .env-file containing port and database url with your credentials.

### Step 5: Database pull

Pull the database with 'npx prisma db pull'. Generate prisma client with 'npx prisma generate'.

### Step 6: Start exploring

Start both your server with 'npm start' in your root and client with 'npm start' in your client. 

