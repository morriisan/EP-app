import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

export function SearchForm({ onSearch, initialValue = "" }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  );
} 