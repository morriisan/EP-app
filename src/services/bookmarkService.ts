import { prisma } from "@/lib/prisma";

export const bookmarkService = {
  async getAllBookmarkedMedia(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
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
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookmarks.map(bookmark => bookmark.media);
  },

  async checkBookmarkStatus(userId: string, mediaId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_mediaId: { userId, mediaId } }
    });
    return !!bookmark;
  },

  async createBookmark(userId: string, mediaId: string, collectionId?: string) {
    return await prisma.bookmark.create({
      data: { userId, mediaId, collectionId }
    });
  },

  async deleteBookmark(userId: string, mediaId: string) {
    return await prisma.bookmark.delete({
      where: { userId_mediaId: { userId, mediaId } }
    });
  }
}; 