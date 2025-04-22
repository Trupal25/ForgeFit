# ForgeFit

ForgeFit is a web application for managing fitness routines, tracking workouts, and exploring nutritional information. It offers a user-friendly interface for searching exercises, creating workout plans, and looking up food nutrition data.

## Features

- **Exercise Management**: Browse and filter exercises by difficulty, muscle groups, and equipment.
- **Workout Planning**: Create and manage personalized workout routines.
- **Nutrition Lookup**: Search for nutritional information using the CalorieNinja API.
- **Responsive Design**: Optimized for both desktop and mobile.

## Technologies

- **Frontend**: React, TypeScript, Next.js
- **Backend**: bun.js, Express, Next.js Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- node.js (18+)
- PostgreSQL
- A code editor (e.g., VS Code)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Trupal25/ForgeFit.git
   cd ForgeFit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```plaintext
   DATABASE_URL="your_database_connection_string"
   X-Api-Key="your_calorieninjas_api_key"
   ```

4. Run migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

Creative Commons NonCommercial (CC BY-NC) License

You are free to:

- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- NonCommercial — You may not use the material for commercial purposes.

No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

For more details, visit: https://creativecommons.org/licenses/by-nc/4.0/

## Acknowledgments

Thanks to the contributors and the CalorieNinja API for nutritional data.
