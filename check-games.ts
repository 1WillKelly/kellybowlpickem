import { prisma } from "./src/server/db/client";

async function checkGames() {
  const games = await prisma.footballMatchup.findMany({
    orderBy: {
      startDate: "asc",
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      season: true,
    },
  });

  console.log(`Found ${games.length} games\n`);

  games.forEach((game, idx) => {
    console.log(`${idx + 1}. ${game.name || "NO NAME"}`);
    console.log(`   ${game.awayTeam.name} @ ${game.homeTeam.name}`);
    console.log(`   Date: ${game.startDate.toISOString().split('T')[0]}`);
    console.log(`   Season: ${game.season.year}`);
    console.log("");
  });

  await prisma.$disconnect();
}

checkGames().catch(console.error);
