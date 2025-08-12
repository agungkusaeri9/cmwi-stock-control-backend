import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedSuppliers() {
  await prisma.supplier.createMany({
    data: [
      {
        name: "Nippon Steel Trading Matex Co.,LTD",
      },
      {
        name: "PT MEITOKU WADAYAMA INDONESIA",
      },
      {
        name: "CV Wahyu Arta Technic",
      },
      {
        name: "PT Fawwazindo Ghina Persada",
      },
      {
        name: "PT UMETOKU INDONESIA",
      },
      {
        name: "CV Beta Gaberta Mekanindo",
      },
      {
        name: "PT Precision Tools Service Indonesia",
      },
      {
        name: "PT Sinar Mutiara Cakrabuana",
      },
      {
        name: "PT Swif Asia",
      },
      {
        name: "PT Tempsens Asia Jaya",
      },
      {
        name: "PT TEMPSENS ASIA JAYA",
      },
      {
        name: "Toyotsu Machinery Corporation",
      },
      {
        name: "Sankensangyo Co., Ltd",
      },
      {
        name: "CV United Controls",
      },
      {
        name: "PT Zenbi Machinery And Electronics Indonesia",
      },
      {
        name: "PT Minezawa Trading Indonesia",
      },
      {
        name: "CV Sinar Artha Technic",
      },
      {
        name: "PT KINARYA NUSANTARA SUKSESTY",
      },
      {
        name: "PT Bukit Mas Bearindo",
      },
      {
        name: "PT Inox Prima",
      },
      {
        name: "PT Pandu Hydro Pneumatics",
      },
      {
        name: "CV Intisupplies Mega Perkasa",
      },
      {
        name: "Lucky Dragon International Co., Ltd.",
      },
      {
        name: "Mitsui Kiko Co., Ltd",
      },
      {
        name: "PT Zahwan Mitrateknindo",
      },
      {
        name: "PT DUTA SWARNA DWIPA",
      },
      {
        name: "PT ARTIUM ALBA RAYA",
      },
      {
        name: "PT ARPHUS REKA MANDIRI",
      },
      {
        name: "PT Misumi Indonesia",
      },
      {
        name: "-",
      },
      {
        name: "Tounetsu Thai Co  Ltd",
      },
      {
        name: "PT. STAHLINDO SURFACING INDONESIA",
      },
      {
        name: "CV. BUANA SINERGI ENGINEERING",
      },
      {
        name: "PT. YKT GEAR",
      },
      {
        name: "PT Sinto Indonesia",
      },
      {
        name: "PT Himalaya Everest Jaya",
      },
      {
        name: "Kiwa Machinery Co., Ltd",
      },
      {
        name: "PT Indobearing Perkasa",
      },
      {
        name: "PT Tuffiadi Semesta",
      },
      {
        name: "PT Geronimo Sukses Mandiri",
      },
      {
        name: "PT. PUSACO INTERNATIONAL",
      },
      {
        name: "Kanzaki Kokyukoki Mfg Co Ltd",
      },
      {
        name: "PT AMCO Multitech",
      },
      {
        name: "PT Fanuc Indonesia",
      },
      {
        name: "PT Numacindo Karsakharisma",
      },
      {
        name: "CV Wira Griya Mustika",
      },
      {
        name: "DAIMA II",
      },
      {
        name: "KUO CHUAN MACHINERY INDUSTRIAL CO.,LTD.",
      },
      {
        name: "CV Senta Andalan Kimia",
      },
      {
        name: "PT Setsuyo Astec",
      },
      {
        name: "PT Flexindomas",
      },
      {
        name: "CV Qistech Plasindo",
      },
      {
        name: "PT. KOBELINDO COMPRESSORS",
      },
      {
        name: "PT Traktor Nusantara",
      },
      {
        name: "PT Axia Multi Sarana",
      },
      {
        name: "PT. Creative Mitra Selaras Indonesia",
      },
      {
        name: "PT Stark Asia Corporindo",
      },
      {
        name: "PT Daiichi Mandiri Automation",
      },
      {
        name: "PT Mega Tekhnik Dhealfian",
      },
      {
        name: "PT Panel Bakti Sinarindo",
      },
      {
        name: "PT Keyence Indonesia",
      },
      {
        name: "PT Elmecon Multikencana",
      },
      {
        name: "PT Azbil Berca Indonesia",
      },
      {
        name: "PT Toyota Tsusho Mechanical & Engineering Service Indonesia",
      },
      {
        name: "PT Hikari Automaton Indonesia",
      },
      {
        name: "Chubu Meikiko . Co.Ltd",
      },
      {
        name: "TOYOTA TSUSHO CORPORATION",
      },
      {
        name: "PT Kawan Lama Sejahtera",
      },
      {
        name: "PT Yutaka Robot System Indonesia",
      },
      {
        name: "Ray Corporation Tokyo Branch",
      },
      {
        name: "PT Amano Indonesia",
      },
      {
        name: "PT. SETIAWAN TEKNIK",
      },
      {
        name: "Shan Long Mechanical Engineering CO. Ltd",
      },
      {
        name: "PT. Kobelindo Compressors",
      },
      {
        name: "PT Taiyo Sinar Raya Teknik",
      },
      {
        name: "PT. BIOTECH INDO GEMILANG",
      },
      {
        name: "PT Sinar Buana",
      },
      {
        name: "PT Orugg Vision Indonesia",
      },
      {
        name: "CV Bintang Mayoki",
      },
      {
        name: "CV HERRY & CO",
      },
      {
        name: "Isuzu MFG Co Ltd",
      },
      {
        name: "PT PUTRA PARUNG JAYA",
      },
      {
        name: "PT. Daichi Mandiri Automation",
      },
      {
        name: "PT ZIEKA TEKNIKATAMA INDONESIA",
      },
      {
        name: "PT MORITA PRECISION INDONESIA",
      },
      {
        name: "PT Kyoritsu Electric Indonesia",
      },
      {
        name: "PT OTOMASI SOLUSI INTI",
      },
      {
        name: "PT YOTANO TEKNIK INDONESIA",
      },
      {
        name: "PT Wilisindomas Indah Makmur",
      },
      {
        name: "PT Kurita Indonesia",
      },
      {
        name: "PT. Victory Win Solusindo",
      },
      {
        name: "PT Gandox Jaya Chemical",
      },
      {
        name: "CV BINTANG MAYOKI",
      },
      {
        name: "PT. INDONESIA ROAD DEVELOPMENT",
      },
      {
        name: "SAXON Test- and Tank- Equipment GmbH",
      },
      {
        name: "PT. HIMAWAN PUTRA",
      },
      {
        name: "Yu Shine Precision",
      },
      {
        name: "PT Pelita Karya Suplindo",
      },
      {
        name: "",
      },
      {
        name: "PT ISK",
      },
      {
        name: "SWIF ASIA",
      },
      {
        name: "PT Jaya Induksi Elektrik",
      },
      {
        name: "Sougou Plant Co;LTD",
      },
      {
        name: "PT Parker Engineering Indonesia",
      },
      {
        name: "PT SARANA HEKSA AUTOMASI FOKUSINDO",
      },
      {
        name: "PT Arphus Reka Mandiri",
      },
      {
        name: "CV Herry & Co",
      },
      {
        name: "PT. PILAR PLATINUM MULIA",
      },
      {
        name: "PT Kawamura Indah",
      },
      {
        name: "PT. HIDUP SEJAHTERA ENGINEERING",
      },
      {
        name: "PT SM-Cyclo Indonesia",
      },
      {
        name: "PT. RODA HAMMERINDO JAYA",
      },
      {
        name: "PT. MONDYLIA AMERTA",
      },
      {
        name: "YUTAKA DENSHI",
      },
      {
        name: "Yutaka Denshi",
      },
      {
        name: "Central Motor Wheel Of America",
      },
      {
        name: "PT MAKMUR META GRAHA DINAMIKA",
      },
      {
        name: "PT Geronimo Sukses MAndiri",
      },
      {
        name: "CV. Wahana Engineering/Geronimo",
      },
    ],
    skipDuplicates: true,
  });
}
