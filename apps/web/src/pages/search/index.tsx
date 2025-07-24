import LinkGrid from '@/components/link-grid';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useQuery } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { isEmpty } from 'lodash';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [debounceKeyword] = useDebouncedValue(keyword, {
    wait: 300,
  });

  const action = useAction(api.search.searchLinks);

  const query = useQuery({
    queryKey: ['search', debounceKeyword],
    queryFn: () => action({ keyword: debounceKeyword }),
    enabled: !!debounceKeyword,
  });

  return (
    <div className="h-full flex flex-col gap-2">
      <div>
        <Input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          autoFocus
          placeholder="Input any keyword..."
        />
      </div>
      <div className="flex-1 h-0">
        {query.isLoading && (
          <div className="size-full flex justify-center items-center flex-col gap-2">
            <Loader className="animate-spin" />
            <div>Searching...</div>
          </div>
        )}
        {isEmpty(query.data) && (
          <div className="size-full flex flex-col gap-2 justify-center items-center">
            <div>No results</div>
          </div>
        )}
        {!isEmpty(query.data) && (
          <ScrollArea className="size-full">
            <LinkGrid links={query.data!} />
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Search;
