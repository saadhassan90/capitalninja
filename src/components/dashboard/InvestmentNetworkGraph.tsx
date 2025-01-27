import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

const InvestmentNetworkGraph = () => {
  const { data: networkData, isLoading } = useQuery({
    queryKey: ["networkData"],
    queryFn: async () => {
      // Fetch LPs and their direct investments
      const { data: investments } = await supabase
        .from("direct_investments")
        .select("*, limited_partner:limited_partners(limited_partner_name)");

      if (!investments) return { nodes: [], edges: [] };

      const nodes: Node[] = [];
      const edges: Edge[] = [];
      const processedLPs = new Set();

      investments.forEach((investment) => {
        // Add LP node if not already added
        if (!processedLPs.has(investment.limited_partner_id)) {
          nodes.push({
            id: `lp-${investment.limited_partner_id}`,
            data: { 
              label: investment.limited_partner?.limited_partner_name || "Unknown LP",
              type: "LP" 
            },
            position: { x: 0, y: 0 }, // Position will be randomized
            type: "lpNode",
            className: "bg-primary/10 border-primary/20"
          });
          processedLPs.add(investment.limited_partner_id);
        }

        // Add company node
        if (investment.company_name) {
          const companyId = `company-${investment.company_name.replace(/\s+/g, '-')}`;
          if (!nodes.find(n => n.id === companyId)) {
            nodes.push({
              id: companyId,
              data: { 
                label: investment.company_name,
                type: "Company"
              },
              position: { x: 0, y: 0 }, // Position will be randomized
              type: "companyNode",
              className: "bg-secondary/10 border-secondary/20"
            });
          }

          // Add edge
          edges.push({
            id: `${investment.limited_partner_id}-${companyId}`,
            source: `lp-${investment.limited_partner_id}`,
            target: companyId,
            animated: true,
            style: { stroke: 'hsl(var(--primary))' }
          });
        }
      });

      // Randomize node positions in a circle
      const radius = 300;
      const centerX = 400;
      const centerY = 300;
      
      nodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;
        node.position = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });

      return { nodes, edges };
    }
  });

  if (isLoading) {
    return <div>Loading network data...</div>;
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Investment Network</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ReactFlow
          nodes={networkData?.nodes || []}
          edges={networkData?.edges || []}
          fitView
          attributionPosition="bottom-right"
          nodesDraggable={true}
          className="bg-background"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </CardContent>
    </Card>
  );
};

export default InvestmentNetworkGraph;