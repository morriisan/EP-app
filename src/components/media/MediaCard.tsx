import Image from "next/image";
import { Media } from "@/components/Interface/media";

interface MediaCardProps {
  media: Media;
  onEdit?: (media: Media) => void;
  onDelete?: (mediaId: string) => void;
  onTagSelect: (tagName: string) => void;
  isAdmin?: boolean;
}

export function MediaCard({ 
  media, 
  onEdit, 
  onDelete, 
  onTagSelect,
  isAdmin = false 
}: MediaCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="relative aspect-square">
        <Image
          src={media.url}
          alt={media.title || "Uploaded media"}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex flex-wrap gap-1">
            {media.tags.map((tag) => (
              <button
                key={tag.id}
                className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm hover:bg-black/70 transition-colors"
                onClick={() => onTagSelect(tag.name)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isAdmin && (
      <div className="p-4">
          <h3 className="font-semibold truncate">{media.title || "Untitled"}</h3>
        
        {onEdit && onDelete && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit(media)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(media.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
} 