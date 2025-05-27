import { prisma } from "@/lib/prisma";

export interface TagWithCount {
  id: string;
  name: string;
  _count: {
    media: number;
  };
}

export class TagService {
  /**
   * Get all tags with their usage count
   */
  static async getAllTagsWithCount(): Promise<TagWithCount[]> {
    try {
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              media: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return tags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw new Error("Failed to fetch tags");
    }
  }

  /**
   * Delete a tag by ID (only if not used by any media)
   */
  static async deleteTag(tagId: string): Promise<void> {
    try {
      // Check if tag exists and count media using it
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
        include: {
          _count: {
            select: {
              media: true
            }
          }
        }
      });

      if (!tag) {
        throw new Error("Tag not found");
      }

      // Don't allow deletion if tag is still being used
      if (tag._count.media > 0) {
        throw new Error(`Cannot delete tag "${tag.name}" because it is used by ${tag._count.media} media item(s)`);
      }

      // Delete the tag
      await prisma.tag.delete({
        where: { id: tagId }
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete tag");
    }
  }

  /**
   * Get a single tag by ID with usage count
   */
  static async getTagById(tagId: string): Promise<TagWithCount | null> {
    try {
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
        include: {
          _count: {
            select: {
              media: true
            }
          }
        }
      });

      return tag;
    } catch (error) {
      console.error("Error fetching tag:", error);
      throw new Error("Failed to fetch tag");
    }
  }

  /**
   * Find a tag by name (case-insensitive)
   */
  static async findTagByName(name: string): Promise<TagWithCount | null> {
    try {
      const tag = await prisma.tag.findUnique({
        where: { name: name.toLowerCase().trim() },
        include: {
          _count: {
            select: {
              media: true
            }
          }
        }
      });

      return tag;
    } catch (error) {
      console.error("Error finding tag by name:", error);
      throw new Error("Failed to find tag");
    }
  }

  /**
   * Create a new tag
   */
  static async createTag(name: string): Promise<TagWithCount> {
    try {
      const normalizedName = name.toLowerCase().trim();
      
      // Check if tag already exists
      const existingTag = await this.findTagByName(normalizedName);
      if (existingTag) {
        throw new Error(`Tag "${name}" already exists`);
      }

      const tag = await prisma.tag.create({
        data: { name: normalizedName },
        include: {
          _count: {
            select: {
              media: true
            }
          }
        }
      });

      return tag;
    } catch (error) {
      console.error("Error creating tag:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create tag");
    }
  }

  /**
   * Get unused tags (tags with 0 media items)
   */
  static async getUnusedTags(): Promise<TagWithCount[]> {
    try {
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              media: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return tags.filter(tag => tag._count.media === 0);
    } catch (error) {
      console.error("Error fetching unused tags:", error);
      throw new Error("Failed to fetch unused tags");
    }
  }
} 