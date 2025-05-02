import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

async function main() {
    await prisma.user.createMany({
        data: [
            {
                username: 'admin',
                name: 'Admin',
                password: await bcrypt.hash('admin', 10),
            }
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
