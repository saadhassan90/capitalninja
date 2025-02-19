
interface ListHeaderProps {
  selectedInvestors: string[];
  totalInvestors: number;
  listId: string;
  onClearSelection: () => void;
}

export function ListHeader({ 
  selectedInvestors, 
  totalInvestors, 
  listId,
  onClearSelection,
}: ListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        {selectedInvestors.length > 0 ? (
          <BulkActions
            selectedCount={selectedInvestors.length}
            selectedInvestors={selectedInvestors}
            onClearSelection={onClearSelection}
            listId={listId}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            Total Investors: {totalInvestors}
          </div>
        )}
      </div>
    </div>
  );
}
