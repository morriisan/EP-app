import { prisma } from "@/lib/prisma";

export const mediaService = {
  async getAllMedia(tagFilter?: string[]) {
    return await prisma.media.findMany({
      where: {
        ...(tagFilter && tagFilter.length > 0 && {
          tags: {
            some: {
              name: {
                in: tagFilter,
              },
            },
          },
        }),
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });
  },

  async getAllTags() {
    return await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  },

  async getMediaById(id: string) {
    return await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
      },
    });
  },

  async updateMedia(id: string, title: string, tags: string[]) {
    return await prisma.media.update({
      where: { id },
      data: {
        title,
        tags: {
          set: [], // Clear existing tags
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async deleteMedia(id: string) {
    return await prisma.media.delete({
      where: { id },
    });
  }
}; 