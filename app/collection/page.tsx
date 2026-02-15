import Header from "../components/Navbar";
import JerseyCard from "../components/JerseyCard";
import { prisma } from "@/lib/db";

async function getJerseys() {
  const jerseys = await prisma.jersey.findMany({
    orderBy: { createdAt: "desc" },
  });
  return jerseys;
}

export default async function Collection() {
  const jerseys = await getJerseys();

  return (
    <>
      <Header />

      <div className="min-h-screen pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Collection</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jerseys.map((jersey) => (
              <JerseyCard
                key={jersey.id}
                id={jersey.id}
                team={jersey.team}
                season={jersey.season}
                image={jersey.image}
                player={jersey.player || undefined}
                number={jersey.number || undefined}
                size={jersey.size}
                condition={jersey.condition}
                notes={jersey.notes || undefined}
              />
            ))}
          </div>

          {jerseys.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                No jerseys in your collection yet
              </p>
              <a
                href="/add"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Add Your First Jersey
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
