
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { validateInput } from '../api/bitcoinAPI';
import { toast } from 'sonner';

interface AddressSearchProps {
  onSearch: (value: string) => void;
  isLoading: boolean;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSearch, isLoading }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateInput(searchValue);
    if (validation.type === 'invalid') {
      toast.error('Please enter a valid Bitcoin address or transaction ID');
      return;
    }
    
    onSearch(validation.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-2">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Enter Bitcoin address or transaction ID"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full bg-black/40 border-[#7E69AB]/30 text-white placeholder:text-gray-400 h-12 rounded-md neo-border focus:border-[#9b87f5]/50 transition-all"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="olympus-button h-12"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Track Path
          </>
        )}
      </Button>
    </form>
  );
};

export default AddressSearch;
