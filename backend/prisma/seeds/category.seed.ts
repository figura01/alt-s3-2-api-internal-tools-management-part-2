// prisma/seeds/category.seed.ts

import type { PrismaClient } from '@prisma/client';

import { categoriesData } from '../data/categories.data';

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  console.log('🏷️ Seeding categories...');

  const categoryMap = new Map<string, string>();

  for (const category of categoriesData) {
    const savedCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    categoryMap.set(savedCategory.slug, savedCategory.id);
  }

  console.log(`✅ ${categoryMap.size} categories seeded.`);

  return categoryMap;
}
