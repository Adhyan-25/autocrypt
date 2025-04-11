
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressData, Transaction } from '../api/bitcoinAPI';
import { ArrowUpRight, ArrowDownLeft, Link, Cpu, ExternalLink } from 'lucide-react';

interface TransactionDetailsProps {
  data: AddressData | null;
  onAddressClick: (address: string) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ data, onAddressClick }) => {
  if (!data || !data.transactions.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="neo-card overflow-hidden">
        <CardHeader className="border-b border-[#9b87f5]/10 bg-gradient-to-r from-black to-[#1A1F2C]/40">
          <CardTitle className="text-xl flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-[#D6BCFA]" />
            <span className="text-[#D6BCFA]">Address Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Address</span>
              <span className="font-mono text-sm break-all text-[#9b87f5]">{data.address}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Transactions</span>
              <span className="text-[#D6BCFA]">{data.transactions.length}</span>
            </div>
            <div>
              <a 
                href={`https://www.blockchain.com/explorer/addresses/btc/${data.address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#7E69AB] hover:text-[#9b87f5] inline-flex items-center group transition-colors"
              >
                <ExternalLink className="h-3 w-3 mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                View on Blockchain.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-[#D6BCFA] flex items-center">
          <Cpu className="h-4 w-4 mr-2" />
          Transactions
        </h3>
        {data.transactions.slice(0, 5).map((tx) => (
          <TransactionCard 
            key={tx.hash} 
            transaction={tx} 
            address={data.address} 
            onAddressClick={onAddressClick}
          />
        ))}
        
        {data.transactions.length > 5 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Showing 5 of {data.transactions.length} transactions
          </p>
        )}
      </div>
    </div>
  );
};

interface TransactionCardProps {
  transaction: Transaction;
  address: string;
  onAddressClick: (address: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, address, onAddressClick }) => {
  // Calculate total input and output values
  const totalInput = transaction.inputs.reduce((sum, input) => sum + input.value, 0);
  const totalOutput = transaction.outputs.reduce((sum, output) => sum + output.value, 0);

  // Determine if this address is mostly a sender or receiver in this transaction
  const isMainlySender = transaction.inputs.some(input => input.address === address);
  
  return (
    <Card className="neo-card overflow-hidden">
      <CardHeader className="pb-2 border-b border-[#9b87f5]/10 bg-gradient-to-r from-black to-[#1A1F2C]/40">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            {isMainlySender ? (
              <ArrowUpRight className="h-4 w-4 mr-2 text-red-400" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 mr-2 text-green-400" />
            )}
            <span className="font-mono text-xs text-[#D6BCFA]">{transaction.hash.substring(0, 10)}...</span>
          </div>
          <a 
            href={`https://www.blockchain.com/explorer/transactions/btc/${transaction.hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#7E69AB] hover:text-[#9b87f5] text-xs flex items-center group transition-colors"
          >
            <ExternalLink className="h-3 w-3 mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            View
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="text-xs space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Inputs ({transaction.inputs.length})</span>
              <span className="text-[#D6BCFA]">{totalInput.toFixed(8)} BTC</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 neo-border rounded p-1">
              {transaction.inputs.map((input, idx) => (
                <div key={`input-${idx}`} className="flex justify-between items-center">
                  <button
                    onClick={() => onAddressClick(input.address)}
                    className="font-mono text-xs truncate max-w-[150px] hover:text-[#D6BCFA] text-left transition-colors"
                    title={input.address}
                  >
                    {input.address.substring(0, 6)}...{input.address.substring(input.address.length - 4)}
                  </button>
                  <span>{input.value.toFixed(8)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Outputs ({transaction.outputs.length})</span>
              <span className="text-[#D6BCFA]">{totalOutput.toFixed(8)} BTC</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 neo-border rounded p-1">
              {transaction.outputs.map((output, idx) => (
                <div key={`output-${idx}`} className="flex justify-between items-center">
                  <button
                    onClick={() => onAddressClick(output.address)}
                    className="font-mono text-xs truncate max-w-[150px] hover:text-[#D6BCFA] text-left transition-colors"
                    title={output.address}
                  >
                    {output.address.substring(0, 6)}...{output.address.substring(output.address.length - 4)}
                  </button>
                  <span>{output.value.toFixed(8)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-400">
            Fee: <span className="text-[#7E69AB]">{(totalInput - totalOutput).toFixed(8)} BTC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
