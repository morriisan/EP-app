import { Tag } from "@/components/Interface/media";

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.name)}
          className={`px-5 py-2 rounded-md text-sm transition duration-300 hover:scale-105 ${
            selectedTags.includes(tag.name)
              ? "bg-pink-600 text-white shadow-md"
              : "bg-pink-100 text-pink-800 hover:bg-pink-200 border border-pink-300"
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
} 