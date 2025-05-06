import { Tag } from "@/components/Interface/media";

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.name)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            selectedTags.includes(tag.name)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 "
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
} 