import "dotenv/config";
import prisma from "../src/db.js";

const users = [
  { username: "riya_travels", email: "riya@example.com", fullname: "Riya Sharma", bio: "Travel, coffee and sunsets", isPrivate: false },
  { username: "akshat_codes", email: "akshat@example.com", fullname: "Akshat Rane", bio: "Building things with code", isPrivate: false },
  { username: "meera_clicks", email: "meera@example.com", fullname: "Meera Patel", bio: "Photography enthusiast", isPrivate: true },
  { username: "arjun_foodie", email: "arjun@example.com", fullname: "Arjun Singh", bio: "Finding the best food spots", isPrivate: false },
  { username: "sana_art", email: "sana@example.com", fullname: "Sana Khan", bio: "Art and little moments", isPrivate: false }
];

const posts = [
  { imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", caption: "Chasing mountain views", location: "Manali" },
  { imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455", caption: "A sky full of stars", location: "Pune" },
  { imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", caption: "Coffee makes everything better", location: "Mumbai" },
  { imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e", caption: "Weekend escape", location: "Manali" },
  { imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", caption: "Good food, good mood", location: "Pune" },
  { imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f", caption: "Making something colourful", location: "Delhi" },
  { imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b", caption: "Ocean state of mind", location: "Goa" },
  { imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", caption: "Dinner with friends", location: "Mumbai" },
  { imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", caption: "Slow mornings", location: "Pune" },
  { imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", caption: "One more summit", location: "Manali" },
  { imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7", caption: "A little fresh air", location: "Goa" },
  { imageUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94", caption: "Golden hour", location: "Delhi" }
];

async function main() {
  // Upsert makes the seed script safe to rerun without duplicate users.
  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        email: user.email,
        fullname: user.fullname,
        bio: user.bio,
        isPrivate: user.isPrivate
      },
      create: user
    });
  }

  // Insert sample posts only when no posts exist, so repeated seed runs don't multiply them.
  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.createMany({ data: posts });
  }

  console.log(`Seed complete: ${await prisma.user.count()} users, ${await prisma.post.count()} posts`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
