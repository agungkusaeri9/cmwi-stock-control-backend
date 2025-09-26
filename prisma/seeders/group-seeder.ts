import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedGroups() {
  const groupsData = [
    { id: 1, name: "A", description: "Grup A" },
    { id: 2, name: "B", description: "Grup B" },
    { id: 3, name: "C", description: "Grup C" },
    { id: 4, name: "NS", description: "Grup NS" },
    { id: 5, name: "Others Dept", description: "Departemen Lain" },
  ];

  const groups: Record<string, number> = {};

  // Simpan group IDs
  for (const g of groupsData) {
    const group = await prisma.group.upsert({
      where: { name: g.name },
      update: {
        name: g.name,
        description: g.description,
      },
      create: g,
    });
    groups[g.name] = group.id;
  }

  // Mapping requesters
  const requestersData: { name: string; group: string }[] = [
    { name: "AJI RIDWAN", group: "NS" },
    { name: "PUJI", group: "NS" },
    { name: "HAMZAH SYAM", group: "NS" },
    { name: "ARIEZ H", group: "NS" },
    { name: "TAHYA R", group: "NS" },
    { name: "M NASIR", group: "NS" },
    { name: "A FAHMI", group: "NS" },
    { name: "EKO BUDI", group: "NS" },
    { name: "M SAEFURROHMAT", group: "NS" },
    { name: "AGRI BUHORI", group: "NS" },
    { name: "IMAM FADLI", group: "NS" },
    { name: "TOMI N", group: "NS" },
    { name: "DANANG", group: "NS" },
    { name: "ARJUN P", group: "NS" },
    { name: "AHMAD MUKTAFI", group: "NS" },

    { name: "FUJIONO", group: "A" },
    { name: "ANGGA M NUR", group: "A" },
    { name: "ONIK K", group: "A" },
    { name: "SUGENG", group: "A" },
    { name: "UJANG DIAN", group: "A" },
    { name: "HERI SETIAWAN", group: "A" },
    { name: "M ARIS", group: "A" },
    { name: "DWI BUDI", group: "A" },
    { name: "IS SETIABDI ILING W", group: "A" },
    { name: "M. FIKRI NAUFAL", group: "A" },
    { name: "INDRA P", group: "A" },
    { name: "MUCHLISIN", group: "A" },

    { name: "RD DENI G H", group: "B" },
    { name: "BAYU PURNAMA", group: "B" },
    { name: "LUKMAN", group: "B" },
    { name: "M. PASHA", group: "B" },
    { name: "HENDRA PP", group: "B" },
    { name: "RIO ASTRIANDI", group: "B" },
    { name: "RAFI M", group: "B" },
    { name: "EGI H", group: "B" },
    { name: "ERIK H", group: "B" },
    { name: "A. KAMALUDIN", group: "B" },
    { name: "M FAUZI A", group: "B" },

    { name: "FAHRI R", group: "C" },
    { name: "HERI SUSANTO", group: "C" },
    { name: "ARFIAN", group: "C" },
    { name: "S AL AYYUBI", group: "C" },
    { name: "DONIE P K", group: "C" },
    { name: "ANDI PRATAMA", group: "C" },
    { name: "RAHMAT J", group: "C" },
    { name: "HENDRI", group: "C" },
    { name: "TRIONO", group: "C" },
    { name: "M ALI", group: "C" },
    { name: "M AGUNG F", group: "C" },

    { name: "PRODUKSI", group: "Others Dept" },
    { name: "HR-GA", group: "Others Dept" },
    { name: "ENGINEERING", group: "Others Dept" },
    { name: "DA", group: "Others Dept" },
    { name: "QC", group: "Others Dept" },
    { name: "PPIC", group: "Others Dept" },
  ];

  for (const r of requestersData) {
    await prisma.requester.upsert({
      where: { name: r.name }, // If 'name' is unique in your Prisma schema
      update: { group_id: groups[r.group] },
      create: { name: r.name, group_id: groups[r.group] },
    });
  }
}
