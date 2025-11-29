// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@movies-app.com";
    const plainPassword = "Pass123"; // default seed password

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {}, // if exists, do nothing
        create: {
            email,
            password: hashedPassword,
        },
    });

    console.log(`✅ Seeded user: ${user.email}`);
    console.log(`🔑 Password: ${plainPassword}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
