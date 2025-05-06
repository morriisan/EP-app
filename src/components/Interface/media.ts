export type Tag = {
    id: string;
    name: string;
  };
  
  export type Media = {
    id: string;
    url: string;
    title: string | null;
    uploadedAt: string;
    tags: Tag[];
    uploadedBy: {
      id: string;
      name: string;
    };
  };