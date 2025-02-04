import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CategoryAndTypeStep() {
  const { formData, updateFormData } = useRaiseForm();
  const isDebtDisabled = formData.category === "startup" || formData.category === "fund_direct_deal";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.category}
            onValueChange={(value) => updateFormData({ category: value as "fund_direct_deal" | "startup" })}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="fund_direct_deal" id="fund_direct_deal" />
              <Label htmlFor="fund_direct_deal" className="flex-1">
                <div className="font-medium">Fund/Direct Deal</div>
                <p className="text-sm text-muted-foreground">
                  For investment funds and direct investment opportunities
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="startup" id="startup" />
              <Label htmlFor="startup" className="flex-1">
                <div className="font-medium">Startup</div>
                <p className="text-sm text-muted-foreground">
                  For early-stage companies seeking investment
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => updateFormData({ type: value as "equity" | "debt" })}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="equity" id="equity" />
              <Label htmlFor="equity" className="flex-1">
                <div className="font-medium">Equity</div>
                <p className="text-sm text-muted-foreground">
                  Ownership stake in the investment
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="debt" id="debt" disabled />
              <Label htmlFor="debt" className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Debt</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Loan-based investment
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}