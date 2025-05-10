import { prisma } from "@/lib/prisma";

export const bookmarkService = {
  async getAllBookmarkedMedia(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: {
        collections: {
          select: {
            collection: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
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
    });

    return bookmarks.map(bookmark => ({
      media: bookmark.media,
      collections: bookmark.collections.map(bc => bc.collection)
    }));
  },

  async checkBookmarkStatus(userId: string, mediaId: string) {
    try {
      const bookmark = await prisma.bookmark.findUnique({
        where: { userId_mediaId: { userId, mediaId } },
        include: {
          collections: {
            select: {
              collection: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      return {
        isBookmarked: Boolean(bookmark),
        collections: bookmark?.collections.map(bc => bc.collection) || []
      };
    } catch (error) {
      console.error('Database error in checkBookmarkStatus:', error);
      throw error;
    }
  },

  async createBookmark(userId: string, mediaId: string, collectionIds?: string[]) {
    const bookmark = await prisma.bookmark.upsert({
      where: { userId_mediaId: { userId, mediaId } },
      create: {
        userId,
        mediaId,
        collections: {
          create: collectionIds?.map(collectionId => ({
            collection: { connect: { id: collectionId } }
          })) || []
        }
      },
      update: {},
      include: {
        collections: {
          select: {
            collection: true
          }
        }
      }
    });
    return bookmark;
  },

  async addToCollection(userId: string, mediaId: string, collectionId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_mediaId: { userId, mediaId } }
    });

    if (!bookmark) {
      return this.createBookmark(userId, mediaId, [collectionId]);
    }

    return await prisma.bookmarkCollection.create({
      data: {
        bookmarkId: bookmark.id,
        collectionId
      },
      include: {
        collection: true
      }
    });
  },

  async removeFromCollection(userId: string, mediaId: string, collectionId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_mediaId: { userId, mediaId } }
    });

    if (!bookmark) return null;

    return await prisma.bookmarkCollection.delete({
      where: {
        bookmarkId_collectionId: {
          bookmarkId: bookmark.id,
          collectionId
        }
      }
    });
  },

  async deleteBookmark(userId: string, mediaId: string) {
    try {
      // First check if bookmark exists
      const bookmark = await prisma.bookmark.findUnique({
        where: { userId_mediaId: { userId, mediaId } }
      });

      if (!bookmark) {
        return null; // Return null if bookmark doesn't exist
      }

      // Delete the bookmark if it exists
      return await prisma.bookmark.delete({
        where: { userId_mediaId: { userId, mediaId } }
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }
}; 