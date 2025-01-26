import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface InvestorsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InvestorsPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: InvestorsPaginationProps) {
  const getVisiblePages = (current: number, total: number) => {
    const maxVisible = 10;
    const pages: number[] = [];
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    let start = Math.max(2, current - 4);
    let end = Math.min(total - 1, current + 4);

    if (start <= 2) {
      end = Math.min(maxVisible - 1, total - 1);
    }
    if (end >= total - 1) {
      start = Math.max(2, total - maxVisible + 2);
    }

    if (start > 2) {
      pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push(-1);
    }

    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {getVisiblePages(currentPage, totalPages).map((page, index) => {
          if (page === -1) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="px-4">...</span>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}