import { Suspense } from "react";

import { bookmarkService } from "@/services/bookmarkService";
import { collectionService } from "@/services/collectionService";
import { BookmarkedMedia } from "@/components/media/BookmarkedMedia";
import { CollectionsList } from "@/components/media/CollectionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuth } from "@/lib/auth-utils";

export default async function MyPage() {
  const session = await requireAuth();
 

  // Fetch data in parallel
  const [bookmarkedMedia, collections] = await Promise.all([
    bookmarkService.getAllBookmarkedMedia(session.user.id),
    collectionService.getUserCollections(session.user.id)
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>
      <Tabs defaultValue="bookmarks">
        <TabsList>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookmarks">
          <Suspense fallback={<div>Loading bookmarks...</div>}>
            <BookmarkedMedia initialMedia={bookmarkedMedia} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="collections">
          <Suspense fallback={<div>Loading collections...</div>}>
            <CollectionsList initialCollections={collections} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}