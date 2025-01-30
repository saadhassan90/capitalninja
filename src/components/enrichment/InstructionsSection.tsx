export function InstructionsSection() {
  return (
    <div className="bg-muted/50 p-4 rounded border">
      <h3 className="font-medium mb-2">How it works</h3>
      <ul className="text-sm text-muted-foreground space-y-2">
        <li>1. Upload a CSV file containing investor information</li>
        <li>2. Our AI analyzes and maps your data columns</li>
        <li>3. The system matches and enriches your data with our database</li>
        <li>4. Download the enriched CSV file with additional insights</li>
      </ul>
    </div>
  );
}