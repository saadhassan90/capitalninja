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
      // If total pages is less than maxVisible, show all pages
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Always include first page
    pages.push(1);

    let start = Math.max(2, current - 4);
    let end = Math.min(total - 1, current + 4);

    // Adjust start and end to show up to maxVisible pages
    if (start <= 2) {
      end = Math.min(maxVisible - 1, total - 1);
    }
    if (end >= total - 1) {
      start = Math.max(2, total - maxVisible + 2);
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Always include last page if there is more than one page
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="sticky bottom-0 bg-background border-t py-4 z-10">
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
    </div>
  );
}