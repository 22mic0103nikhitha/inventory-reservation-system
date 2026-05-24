import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone',
      description: 'Apple Smartphone'
    }
  })

  const macbook = await prisma.product.create({
    data: {
      name: 'MacBook',
      description: 'Apple Laptop'
    }
  })

  const chennai = await prisma.warehouse.create({
    data: {
      name: 'Chennai'
    }
  })

  const bangalore = await prisma.warehouse.create({
    data: {
      name: 'Bangalore'
    }
  })

  await prisma.inventory.create({
    data: {
      productId: iphone.id,
      warehouseId: chennai.id,
      totalStock: 10,
      reservedStock: 0
    }
  })

  await prisma.inventory.create({
    data: {
      productId: macbook.id,
      warehouseId: bangalore.id,
      totalStock: 5,
      reservedStock: 0
    }
  })

  console.log('Seed Data Added')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })