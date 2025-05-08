import { prisma } from "@/lib/prisma";

export const collectionService = {
  async getUserCollections(userId: string) {
    return await prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        bookmarks: {
          select: {
            media: {
              select: {
                id: true,
                url: true,
                title: true,
                tags: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createCollection(userId: string, name: string) {
    return await prisma.collection.create({
      data: {
        userId,
        name,
      },
    });
  },
}; 