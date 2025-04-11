
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, GitFork } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen olympus-bg overflow-hidden relative">
      {/* Animated blobs */}
      <div className="blob blob-purple h-96 w-96 -top-20 -left-20"></div>
      <div className="blob blob-pink h-80 w-80 bottom-1/3 -right-20"></div>
      
      {/* Grid overlay */}
      <div className="olympus-grid"></div>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center">
            <span className="text-gradient-purple glow-text">About AUTOCRYP</span>
          </h1>
          
          <div className="olympus-card p-6 mb-8">
            <p className="text-lg mb-8 text-[#9b87f5]">
              AUTOCRYP is a powerful tool designed to track and visualize Bitcoin transaction paths across the blockchain. Our platform helps users understand the flow of Bitcoin between addresses, making blockchain data more accessible and comprehensible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="olympus-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[#D6BCFA]">
                  <Eye className="h-5 w-5 mr-2 text-[#9b87f5]" />
                  Visualization
                </CardTitle>
                <CardDescription className="text-[#7E69AB]">
                  Interactive graphs that display transaction flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9b87f5]/80">
                  AUTOCRYP transforms complex blockchain data into intuitive visual representations, allowing you to see how Bitcoin moves between addresses. Our interactive graph makes it easy to follow transaction paths and identify patterns.
                </p>
              </CardContent>
            </div>
            
            <div className="olympus-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[#D6BCFA]">
                  <GitFork className="h-5 w-5 mr-2 text-[#9b87f5]" />
                  Path Tracking
                </CardTitle>
                <CardDescription className="text-[#7E69AB]">
                  Follow the money across the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9b87f5]/80">
                  With AUTOCRYP, you can follow Bitcoin as it moves from one address to another. Simply enter any Bitcoin address or transaction ID, and our system will map out the connections, helping you trace the flow of funds.
                </p>
              </CardContent>
            </div>
          </div>

          <div className="olympus-card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#D6BCFA]">How It Works</h2>
            <ol className="space-y-6 mb-8">
              <li className="flex">
                <span className="flex items-center justify-center bg-[#9b87f5]/20 border border-[#9b87f5]/30 rounded-full h-8 w-8 mr-3 shrink-0 text-[#D6BCFA]">1</span>
                <div>
                  <h3 className="font-semibold text-[#D6BCFA]">Enter an Address or Transaction ID</h3>
                  <p className="text-[#7E69AB]">Provide a Bitcoin address or transaction hash to begin the tracking process.</p>
                </div>
              </li>
              <li className="flex">
                <span className="flex items-center justify-center bg-[#9b87f5]/20 border border-[#9b87f5]/30 rounded-full h-8 w-8 mr-3 shrink-0 text-[#D6BCFA]">2</span>
                <div>
                  <h3 className="font-semibold text-[#D6BCFA]">View the Transaction Graph</h3>
                  <p className="text-[#7E69AB]">Our system generates an interactive visualization showing all related transactions.</p>
                </div>
              </li>
              <li className="flex">
                <span className="flex items-center justify-center bg-[#9b87f5]/20 border border-[#9b87f5]/30 rounded-full h-8 w-8 mr-3 shrink-0 text-[#D6BCFA]">3</span>
                <div>
                  <h3 className="font-semibold text-[#D6BCFA]">Explore Transaction Details</h3>
                  <p className="text-[#7E69AB]">Click on any address in the graph to view its detailed transaction history.</p>
                </div>
              </li>
              <li className="flex">
                <span className="flex items-center justify-center bg-[#9b87f5]/20 border border-[#9b87f5]/30 rounded-full h-8 w-8 mr-3 shrink-0 text-[#D6BCFA]">4</span>
                <div>
                  <h3 className="font-semibold text-[#D6BCFA]">Track Paths Further</h3>
                  <p className="text-[#7E69AB]">Continue exploring by following transactions across multiple addresses.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
