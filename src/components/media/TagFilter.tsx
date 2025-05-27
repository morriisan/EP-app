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
          className={`px-5 py-2 rounded-md text-sm transition duration-200 hover:scale-105 ${
            selectedTags.includes(tag.name)
              ? "bg-theme-accent-primary text-white shadow-md"
              : "bg-theme-section-primary text-theme-primary hover:bg-theme-hover-primary border border-theme-border-default"
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
} 