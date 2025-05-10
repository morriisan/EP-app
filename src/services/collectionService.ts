import { prisma } from "@/lib/prisma";

export const collectionService = {
  async getUserCollections(userId: string) {
    const collections = await prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        bookmarks: {
          select: {
            bookmark: {
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
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to match the expected structure
    return collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      bookmarks: collection.bookmarks.map(b => ({
        media: b.bookmark.media
      }))
    }));
  },

  async createCollection(userId: string, name: string) {
    return await prisma.collection.create({
      data: {
        userId,
        name,
      },
    });
  },

  async getCollectionContents(userId: string, collectionId: string) {
    return await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId
      },
      select: {
        id: true,
        name: true,
        bookmarks: {
          select: {
            bookmark: {
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
          }
        }
      }
    });
  }
}; 