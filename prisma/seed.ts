import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminEmail = 'admin@gmail.com'
  const adminPassword = 'admin@gmail.com'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  console.log({ admin })

  // Seed Battery Details with image specs
  const batteryData = {
    sn: 'SN-XOR-001',
    name: 'XORBIT 48V 24AH',
    category: 'Low Speed E-Scooter',
    image: '/spec-1.png',
    nominalVoltage: '48V',
    fullyChargedVoltage: '54V',
    dischargeCutOff: '44V',
    nominalCapacity: '24AH',
    totalEnergy: '1.24 KWH',
    cellConfiguration: '15S LFP CELLS',
    motorCompatibility: '1000W BLDC',
    application: 'Low Speed E-Scooter',
    avgRidingCurrent: '18-20 A',
    estRuntime: '1.0 - 1.2 Hours',
    estRange: '40-60 km*',
    energyEfficiency: '>95%',
    cycleLife: '2000+ Cycles',
    chargingTime: '6-7 Hours**',
  }

  const battery = await prisma.batteryDetail.upsert({
    where: { sn: batteryData.sn },
    update: batteryData,
    create: batteryData,
  })

  console.log({ battery })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
