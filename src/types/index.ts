// Ticket types
export interface Category {
  id: string;
  name: string;
}

export interface Priority {
  id: string;
  name: string;
  level: number;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  authorId: string;
  authorType: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  openDate: string;
  lastUpdate: string;
  userId: string;
  categoryId: string | null;
  priorityId: string | null;
  user: {
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
  priority: {
    id: string;
    name: string;
  } | null;
  replies: TicketReply[];
}

// KB Article types
export interface KbAuthor {
  name: string;
}

export interface KbCategory {
  id: string;
  name: string;
}

export interface KbArticle {
  id: string;
  title: string;
  content: string;
  keywords: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string | null;
  author: KbAuthor;
  category: KbCategory | null;
}

export interface KbCategoryWithCount {
  id: string;
  name: string;
  _count: {
    kbArticles: number;
  };
}
