"use server";

import type { Prisma } from "@/generated/client";
import { prisma } from "@/lib/prisma";

export async function getPublishedKbArticles(
  categoryId?: string,
  searchQuery?: string,
) {
  try {
    const where: Prisma.KbArticleWhereInput = {
      published: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const search = searchQuery.trim();
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { keywords: { contains: search, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.kbArticle.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return { success: true, articles };
  } catch (error) {
    console.error("Error fetching KB articles:", error);
    return { error: "Failed to fetch articles" };
  }
}

export async function getKbArticleById(id: string) {
  try {
    const article = await prisma.kbArticle.findFirst({
      where: {
        id,
        published: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!article) {
      return { error: "Article not found" };
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching KB article:", error);
    return { error: "Failed to fetch article" };
  }
}

export async function getKbCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        kbArticles: {
          some: {
            published: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            kbArticles: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching KB categories:", error);
    return { error: "Failed to fetch categories" };
  }
}
