import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import { seedGroups } from "./seeders/group-seeder";
import { seedSubMachines } from "./seeders/submachine-seeder";
// import { seedAreas } from "./seeders/area-seeder";
// import { seedRacks } from "./seeders/rack-seeder";
// import { seedKanbans1 } from "./seeders/kanban-1-seeder";
// import { seedKanbans2 } from "./seeders/kanban-2-seeder";
// import { seedKanbans3 } from "./seeders/kanban-3-seeder";
// import { seedKanbans4 } from "./seeders/kanban-4-seeder";
// import { seedSuppliers } from "./seeders/supplier-seeder";
// import { seedMakers } from "./seeders/maker-seeder";
// import { seedMachines } from "./seeders/machine-seeder";

async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      name: "Admin",
      password: await bcrypt.hash("admin", 10),
    },
    create: {
      username: "admin",
      name: "Admin",
      password: await bcrypt.hash("admin", 10),
    },
  });

  const operators = [
    { nik: "1808611", name: "Fahmi" },
    { nik: "1910802", name: "Muchlis" },
    { nik: "1804573", name: "Fauzi" },
    { nik: "1711539", name: "Agung" },
  ];

  for (const op of operators) {
    const username = op.name.toLowerCase();
    const password = await bcrypt.hash(username, 10);

    // upsert user dulu
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        name: op.name,
        password,
      },
      create: {
        username,
        name: op.name,
        password,
      },
    });

    // upsert operator, kaitkan dengan user_id
    await prisma.operator.upsert({
      where: { nik: op.nik },
      update: {
        name: op.name,
        user_id: user.id,
      },
      create: {
        nik: op.nik,
        name: op.name,
        user_id: user.id,
      },
    });
  }

  await prisma.$executeRaw`
  UPDATE kanbans
  SET reminded_at = updated_at
`;

  await seedGroups();
  await seedSubMachines();
  // await seedSuppliers();
  // await seedMakers();
  // await seedAreas();
  // await seedRacks();
  // await seedKanbans1();
  // await seedKanbans2();
  // await seedKanbans3();
  // await seedKanbans4();
  // await seedMachines();
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
