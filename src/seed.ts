// src/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        RoleName: 'Admin'
      }
    });

    const userRole = await prisma.role.create({
      data: {
        RoleName: 'User'
      }
    });

    // Create users
    const user1 = await prisma.user.create({
      data: {
        Username: 'user1',
        Email: 'user1@example.com',
        Password: 'password1',
        RoleID: userRole.RoleID
      }
    });

    const user2 = await prisma.user.create({
      data: {
        Username: 'user2',
        Email: 'user2@example.com',
        Password: 'password2',
        RoleID: adminRole.RoleID
      }
    });

    // Create categories
    const category1 = await prisma.category.create({
      data: {
        CategoryName: 'Technology'
      }
    });

    const category2 = await prisma.category.create({
      data: {
        CategoryName: 'Science'
      }
    });

    // Create tags
    const tag1 = await prisma.tag.create({
      data: {
        TagName: 'JavaScript'
      }
    });

    const tag2 = await prisma.tag.create({
      data: {
        TagName: 'Machine Learning'
      }
    });

    // Create content
    const content1 = await prisma.content.create({
      data: {
        ContentType: 'Article',
        Title: 'Introduction to TypeScript',
        ContentDescription: 'A brief introduction to TypeScript.',
        UserID: user1.UserID,
        categories: {
          connect: [{ CategoryID: category1.CategoryID }]
        },
        tags: {
          connect: [{ TagID: tag1.TagID }]
        }
      }
    });

    const content2 = await prisma.content.create({
      data: {
        ContentType: 'Blog',
        Title: 'Getting Started with Machine Learning',
        ContentDescription: 'A beginner\'s guide to starting with ML.',
        UserID: user2.UserID,
        categories: {
          connect: [{ CategoryID: category2.CategoryID }]
        },
        tags: {
          connect: [{ TagID: tag2.TagID }]
        }
      }
    });

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
