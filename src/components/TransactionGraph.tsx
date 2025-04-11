
import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphData } from '../api/bitcoinAPI';

interface TransactionGraphProps {
  data: GraphData;
  onNodeClick?: (addressId: string) => void;
}

const TransactionGraph: React.FC<TransactionGraphProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  
  // Helper functions for node visualization
  const getNodeSize = (d: any) => {
    switch (d.group) {
      case 1: return 10; // Main address
      case 2: return 7;  // Input addresses
      case 3: return 6;  // Output addresses
      default: return 5;
    }
  };

  // Helper function to determine node color
  const getNodeColor = (d: any) => {
    const colors = {
      1: "#D6BCFA", // Main address
      2: "#9b87f5", // Input addresses
      3: "#6E59A5"  // Output addresses
    };
    return colors[d.group as keyof typeof colors];
  };
  
  // Helper function to get group label
  const getGroupLabel = (group: number) => {
    switch (group) {
      case 1: return "Main Address";
      case 2: return "Input Address";
      case 3: return "Output Address";
      default: return "Unknown";
    }
  };
  
  // Drag handler for nodes
  const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Cleanup function to stop any running simulations
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Simple card background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#0d0e12")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("stroke", "rgba(155, 135, 245, 0.2)")
      .attr("stroke-width", 1);

    // Simple header
    const headerHeight = 40;
    svg.append("rect")
      .attr("width", width)
      .attr("height", headerHeight)
      .attr("fill", "#0a0a14")
      .attr("rx", 8)
      .attr("ry", 0);

    // Header border
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", headerHeight)
      .attr("x2", width)
      .attr("y2", headerHeight)
      .attr("stroke", "rgba(155, 135, 245, 0.1)")
      .attr("stroke-width", 1);

    // Add header title
    svg.append("text")
      .attr("x", 20)
      .attr("y", headerHeight / 2 + 5)
      .attr("fill", "#D6BCFA")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Transaction Flow Visualization");

    // Create simple defs for styling
    const defs = svg.append("defs");

    // Simple gradient for links
    defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#9b87f5" },
        { offset: "100%", color: "#D6BCFA" }
      ])
      .join("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Optimized simulation with reduced complexity
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(80))
      .force("charge", d3.forceManyBody()
        .strength(-200)
        .distanceMax(200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alphaDecay(0.1);

    // Store simulation in ref for cleanup
    simulationRef.current = simulation;

    // Simple tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "#D6BCFA")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Add links (connections between nodes) with gradient effect
    const link = svg.append("g")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.value || 1) * 0.5 + 0.5);

    // Add node groups
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation) as any)
      .on("click", (event, d: any) => {
        if (onNodeClick) {
          event.stopPropagation();
          onNodeClick(d.id);
        }
      })
      .on("mouseover", (event, d: any) => {
        tooltip
          .style("visibility", "visible")
          .html(`
            <div>
              <div style="font-weight:bold;font-size:12px;margin-bottom:4px">${getGroupLabel(d.group)}</div>
              <div style="font-size:12px">${d.id}</div>
              ${d.value ? `<div style="font-size:12px;margin-top:4px">Value: ${d.value} BTC</div>` : ''}
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Add selection indicator (initially hidden)
    node.append("circle")
      .attr("r", (d: any) => getNodeSize(d) + 4)
      .attr("fill", "none")
      .attr("stroke", "#D6BCFA")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.3);

    // Simple node rendering
    node.append("circle")
      .attr("r", getNodeSize)
      .attr("fill", getNodeColor)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5);

    // Add text labels for main nodes only
    node.append("text")
      .attr("dx", (d: any) => getNodeSize(d) + 5)
      .attr("dy", ".35em")
      .attr("font-size", "10px")
      .attr("fill", "#D6BCFA")
      .text((d: any) => d.group === 1 ? d.id.substring(0, 8) + '...' : '');

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Add zoom functionality with performance optimizations
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3]) // Limit max zoom for performance
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Add simple legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150}, ${headerHeight + 20})`);

    const legendItems = [
      { group: 1, label: "Main Address" },
      { group: 2, label: "Input Address" },
      { group: 3, label: "Output Address" }
    ];

    legendItems.forEach((item, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendItem.append("circle")
        .attr("r", 5)
        .attr("fill", getNodeColor({ group: item.group }));

      legendItem.append("text")
        .attr("x", 10)
        .attr("y", 4)
        .attr("font-size", "10px")
        .attr("fill", "#D6BCFA")
        .text(item.label);
    });
  }, [data, onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="transaction-graph-container neo-card overflow-hidden rounded-lg shadow-lg"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="500px"
        className="transaction-graph overflow-hidden"
      />
    </div>
  );
};

export default TransactionGraph;
