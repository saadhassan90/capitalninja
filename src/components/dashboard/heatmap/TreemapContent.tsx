import { HEATMAP_COLORS } from "./constants";

interface TreemapContentProps {
  root: any;
}

export const TreemapContent = ({ root }: TreemapContentProps) => {
  if (!root) return null;
  
  return root.children?.map((node: any, index: number) => {
    const { x, y, width, height, name, percentage } = node;
    
    return (
      <g key={name}>
        <rect
          x={x}
          y={y}
          width={width * 0.95}
          height={height * 0.95}
          fill={HEATMAP_COLORS[index % HEATMAP_COLORS.length]}
          stroke="#fff"
          strokeWidth={2}
          rx={8}
          ry={8}
          className="origin-center transition-transform duration-200 hover:scale-[1.02]"
          id={`sector-${index}`}
        />
        {width > 60 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="white"
              className="text-xs font-medium select-none"
            >
              {name.split(' ')[0]}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="white"
              className="text-xs select-none"
            >
              {percentage}%
            </text>
          </>
        )}
      </g>
    );
  });
};