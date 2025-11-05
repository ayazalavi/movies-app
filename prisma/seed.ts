import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
    const u = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: { email: "demo@example.com", password: "demo" }, // hash in real use
    });
    await prisma.movie.createMany({
        data: [
            { title: "Movie 1", year: 2021, ownerId: u.id },
            { title: "Movie 2", year: 2022, ownerId: u.id },
        ],
    });
}
main().finally(() => prisma.$disconnect());
