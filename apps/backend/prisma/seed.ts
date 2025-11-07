import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.customer.deleteMany();
  await prisma.state.deleteMany();
  await prisma.country.deleteMany();

  // Seed Countries with States
  const sriLanka = await prisma.country.create({
    data: {
      name: 'Sri Lanka',
      states: {
        create: [
          { name: 'Western Province' },
          { name: 'Central Province' },
          { name: 'Southern Province' },
          { name: 'Northern Province' },
          { name: 'Eastern Province' },
        ],
      },
    },
  });

  const india = await prisma.country.create({
    data: {
      name: 'India',
      states: {
        create: [
          { name: 'Maharashtra' },
          { name: 'Karnataka' },
          { name: 'Tamil Nadu' },
          { name: 'Delhi' },
          { name: 'Gujarat' },
        ],
      },
    },
  });

  const usa = await prisma.country.create({
    data: {
      name: 'USA',
      states: {
        create: [
          { name: 'California' },
          { name: 'New York' },
          { name: 'Texas' },
          { name: 'Florida' },
          { name: 'Illinois' },
        ],
      },
    },
  });

  console.log('Seeded countries:', { sriLanka, india, usa });
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
