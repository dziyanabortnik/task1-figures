import { ShapesApplication } from './index.js';

// Создание и запуск приложения
const app = new ShapesApplication();
app.run().catch((error) => {
  console.error("Fatal application error:", error);
  process.exit(1);
});
