import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function QueryInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [queryString, setQueryString] = useState<string>('');

  return (
    <div className="flex w-full items-end space-x-2 mb-5">
      <div className="flex-1">
        <label className="block">Query</label>
        <Input
          type="text"
          onChange={e => setQueryString(e.target.value)}
          value={queryString}
          placeholder='ex: [["condition", "=", "P"], ["year_built", "<", "1950"]]'
        />
      </div>
      <Button type="submit" onClick={() => onSearch(queryString)}>
        Search
      </Button>
    </div>
  );
}

export default QueryInput;
