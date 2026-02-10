import { prisma } from "./lib/db";

async function seedWithSQL() {
  // Insert jerseys using raw SQL
  await prisma.$executeRaw`
    INSERT INTO Jersey (id, team, season, player, number, size, condition, image, notes, isPublic, createdAt, updatedAt)
    VALUES 
      ('jersey1', 'Chelsea', '2022-2023', 'Mount', '19', 'M', 'Excellent', '/chelsea.jpg', 'Third kit', 1, datetime('now'), datetime('now')),
      ('jersey2', 'Real Madrid', '2021-2022', 'Benzema', '9', 'L', 'New', '/real madrid.jpg', 'Home kit', 1, datetime('now'), datetime('now')),
      ('jersey3', 'Argentina', '2022', 'Messi', '10', 'M', 'Excellent', '/argentina.jpg', 'World Cup', 1, datetime('now'), datetime('now'))
  `;

  console.log("Jerseys inserted via SQL!");
}

seedWithSQL()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
