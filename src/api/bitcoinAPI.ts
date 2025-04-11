
import { toast } from "sonner";

export interface Transaction {
  hash: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

export interface TransactionInput {
  address: string;
  value: number;
}

export interface TransactionOutput {
  address: string;
  value: number;
}

export interface AddressData {
  address: string;
  transactions: Transaction[];
}

export interface GraphNode {
  id: string;
  group: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const BASE_ADDRESS_URL = "https://blockchain.info/rawaddr/";
const BASE_TX_URL = "https://blockchain.info/rawtx/";

export const fetchAddressData = async (address: string): Promise<AddressData | null> => {
  try {
    const response = await fetch(`${BASE_ADDRESS_URL}${address}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    
    return processAddressData(data, address);
  } catch (error) {
    console.error("Error fetching address data:", error);
    toast.error("Failed to fetch address data. Please try again.");
    return null;
  }
};

export const fetchTransactionData = async (txid: string): Promise<AddressData | null> => {
  try {
    const response = await fetch(`${BASE_TX_URL}${txid}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    
    return processTransactionData(data);
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    toast.error("Failed to fetch transaction data. Please try again.");
    return null;
  }
};

export const validateInput = (input: string): { type: 'address' | 'transaction' | 'invalid', value: string } => {
  const trimmedInput = input.trim();
  
  if (trimmedInput.length === 64) {
    return { type: 'transaction', value: trimmedInput };
  } else if (trimmedInput.length >= 26 && trimmedInput.length <= 35) {
    return { type: 'address', value: trimmedInput };
  } else {
    return { type: 'invalid', value: trimmedInput };
  }
};

const processAddressData = (data: any, address: string): AddressData => {
  const transactions: Transaction[] = data.txs.map((tx: any) => {
    const inputs: TransactionInput[] = tx.inputs
      .filter((input: any) => input.prev_out && input.prev_out.addr)
      .map((input: any) => ({
        address: input.prev_out.addr,
        value: input.prev_out.value / 100000000 // Convert satoshis to BTC
      }));

    const outputs: TransactionOutput[] = tx.out
      .filter((output: any) => output.addr)
      .map((output: any) => ({
        address: output.addr,
        value: output.value / 100000000 // Convert satoshis to BTC
      }));

    return {
      hash: tx.hash,
      inputs,
      outputs
    };
  });

  return {
    address,
    transactions
  };
};

const processTransactionData = (data: any): AddressData => {
  const inputs: TransactionInput[] = data.inputs
    .filter((input: any) => input.prev_out && input.prev_out.addr)
    .map((input: any) => ({
      address: input.prev_out.addr,
      value: input.prev_out.value / 100000000
    }));

  const outputs: TransactionOutput[] = data.out
    .filter((output: any) => output.addr)
    .map((output: any) => ({
      address: output.addr,
      value: output.value / 100000000
    }));

  const transaction: Transaction = {
    hash: data.hash,
    inputs,
    outputs
  };

  // We'll use the first input address as our "main" address for this view
  const mainAddress = inputs.length > 0 ? inputs[0].address : "unknown";

  return {
    address: mainAddress,
    transactions: [transaction]
  };
};

export const generateGraphData = (addressData: AddressData, maxDepth: number = 1): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeSet = new Set<string>();

  // Add the main address as a node
  nodeSet.add(addressData.address);
  nodes.push({ id: addressData.address, group: 1 });

  // Process transactions
  addressData.transactions.forEach(tx => {
    // Add all input addresses as nodes/*
    tx.inputs.forEach(input => {
      if (!nodeSet.has(input.address)) {
        nodeSet.add(input.address);
        nodes.push({ id: input.address, group: 2 });
      }
      
      // Add links from inputs to the main address
      links.push({
        source: input.address,
        target: addressData.address,
        value: input.value
      });
    });

    // Add all output addresses as nodes
    tx.outputs.forEach(output => {
      if (!nodeSet.has(output.address)) {
        nodeSet.add(output.address);
        nodes.push({ id: output.address, group: 3 });
      }
      
      // Add links from the main address to outputs
      if (output.address !== addressData.address) {
        links.push({
          source: addressData.address,
          target: output.address,
          value: output.value
        });
      }
    });
  });

  return { nodes, links };
};
