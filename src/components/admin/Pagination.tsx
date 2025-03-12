import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading 
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || loading}
      >
        Previous
      </Button>
      
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button 
        variant="outline" 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || loading}
      >
        Next
      </Button>
    </div>
  );
} 