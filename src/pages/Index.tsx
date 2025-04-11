
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddressSearch from '@/components/AddressSearch';
import TransactionGraph from '@/components/TransactionGraph';
import TransactionDetails from '@/components/TransactionDetails';
import { 
  fetchAddressData, 
  fetchTransactionData, 
  validateInput, 
  generateGraphData,
  AddressData,
  GraphData 
} from '../api/bitcoinAPI';
import { toast } from 'sonner';
import { Cpu } from 'lucide-react';
import * as d3 from 'd3';

// Memoize child components to prevent unnecessary re-renders
const MemoizedTransactionGraph = memo(TransactionGraph);
const MemoizedTransactionDetails = memo(TransactionDetails);
const MemoizedAddressSearch = memo(AddressSearch);

const 
HomePage = () => {
  const backgroundRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Simplified static background instead of animated stars
  useEffect(() => {
    if (!backgroundRef.current) return;
    
    const svg = d3.select(backgroundRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Clear existing content
    svg.selectAll("*").remove();
    
    // Set dimensions
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .style("position", "fixed")
      .style("top", 0)
      .style("left", 0)
      .style("z-index", 0);
      
    // Background rect
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "black");
    
    // Generate a smaller number of static stars
    const starCount = 150; // Reduced for better performance
    const stars = [];
    
    // Generate stars with simple random distribution
    for (let i = 0; i < starCount; i++) {
      // Create size distribution with mostly small stars
      let radius = Math.random() > 0.95 ? 
        Math.random() * 0.6 + 0.8 : // Few large stars (5%)
        Math.random() * 0.3 + 0.2;  // Mostly small stars (95%)
      
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    
    // Add static stars
    svg.selectAll(".star")
      .data(stars)
      .join("circle")
      .attr("class", "star")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.radius)
      .attr("fill", "#ffffff")
      .attr("opacity", d => d.opacity);
    
    // No animation loop needed for static background
    
    return () => {};
  }, []);
  
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setIsLoading(true);
    try {
      const validation = validateInput(value);
      
      if (validation.type === 'invalid') {
        toast.error('Invalid Bitcoin address or transaction ID');
        setIsLoading(false);
        return;
      }
      
      let data: AddressData | null = null;
      
      if (validation.type === 'address') {
        data = await fetchAddressData(validation.value);
      } else {
        data = await fetchTransactionData(validation.value);
      }
      
      if (data) {
        setAddressData(data);
        const graph = generateGraphData(data);
        setGraphData(graph);
        
        toast.success(`Transaction path for ${validation.value.substring(0, 8)}... loaded successfully`);
      } else {
        toast.error('Failed to load transaction data');
      }
    } catch (error) {
      console.error('Error processing search:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback((address: string) => {
    handleSearch(address);
  }, [handleSearch]);

  return (
    <div className="flex flex-col min-h-screen olympus-bg overflow-hidden relative">
      {/* Stars background */}
      <svg ref={backgroundRef} className="stars-background"></svg>
      
      <Header titleRef={titleRef} />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <section className="mb-12 text-center relative">
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-6 flex justify-center items-center">
            <span className="text-gradient-purple glow-text">
              AUTO<span className="text-[#D6BCFA]">CRYP</span>
            </span>
          </h1>
          <p className="text-xl mb-8 text-[#7E69AB] max-w-2xl mx-auto">
            Track and visualize Bitcoin transaction paths across the blockchain
          </p>
          
          <div className="max-w-2xl mx-auto olympus-card p-6">
            <MemoizedAddressSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>
        
        {/* Recent searches section removed */}
        
        {isLoading && !addressData && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-t-[#D6BCFA] border-r-[#9b87f5] border-b-transparent border-l-transparent animate-spin mb-4"></div>
            </div>
            <p className="text-[#7E69AB]">Loading blockchain data...</p>
          </div>
        )}
        
        {graphData && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 olympus-card p-4">
              {/* Transaction Flow Visualization title moved to card header */}
              <MemoizedTransactionGraph data={graphData} onNodeClick={handleNodeClick} />
            </div>
            
            <div className="olympus-card p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-[#D6BCFA]">
                <Cpu className="h-5 w-5 mr-2" />
                Transaction Details
              </h2>
              <MemoizedTransactionDetails data={addressData} onAddressClick={handleNodeClick} />
            </div>
          </div>
        )}
        
        {!graphData && !isLoading && (
          <div className="text-center mt-16 olympus-card p-8 max-w-2xl mx-auto">
            <Cpu className="h-12 w-12 mx-auto mb-4 text-[#7E69AB] opacity-70" />
            <p className="text-[#9b87f5] mb-4">Enter a Bitcoin address or transaction ID to visualize its path</p>
            <p className="text-xs text-[#7E69AB] mb-2">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <button
                onClick={() => handleSearch("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")}
                className="text-xs bg-black neo-border hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] text-gray-300 py-1 px-3 rounded-md transition-all"
              >
                Satoshi's Address
              </button>
              <button
                onClick={() => handleSearch("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")}
                className="text-xs bg-black neo-border hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] text-gray-300 py-1 px-3 rounded-md transition-all"
              >
                Popular Address
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
