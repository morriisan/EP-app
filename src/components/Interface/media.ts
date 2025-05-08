export type Tag = {
    id: string;
    name: string;
  };
  
  export type Media = {
    id: string;
    url: string;
    title: string | null;
    tags: {
      id: string;
      name: string;
    }[];
  };

  export type Bookmark = {
    id: string;
    userId: string;
    mediaId: string;
    createdAt: string;
    collectionId?: string;
    media: Media;
  };

  export type Collection = {
    id: string;
    name: string;
    bookmarks: {
      media: Media;
    }[];
  };