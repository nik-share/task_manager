# Task Manager

A modern task management application built with Astro, Svelte, and OpenAI integration for intelligent task descriptions.

## Features

- ✨ Create and manage tasks with titles, descriptions, priorities, and due dates
- 🤖 AI-powered task description generation using OpenAI
- 🎨 Clean and responsive UI
- 🔄 Real-time updates with Svelte stores
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- OpenAI API key (for AI description generation)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/nik-share/task_manager.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database?schema=public"
OPENAI_API_KEY="your-openai-api-key"
```

4. Initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:4321`

## Building for Production

```bash
npm run build
```

The built application will be in the `dist` directory.

## Project Structure

```
task-manager/
├── src/
│   ├── components/    # Svelte components
│   ├── lib/          # Shared utilities and types
│   ├── pages/        # Astro pages and API routes
│   └── styles/       # Global styles
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── tests/          # Test files
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key for AI description generation

## Development

### Running Tests

```bash
npm run test
```

### Code Style

The project uses ESLint and Prettier for code formatting. Run:

```bash
npm run lint
npm run format
```

### OpenAI API Issues

If you encounter OpenAI API quota issues, the application will automatically fall back to manual description entry mode.

### Database Connection

Make sure your PostgreSQL server is running and the DATABASE_URL is correctly configured in your .env file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
