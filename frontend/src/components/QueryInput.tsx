import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function QueryInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [queryString, setQueryString] = useState<string>('')

  return (
    <div className="flex w-full items-center space-x-2 mb-5">
      <Input type="text" onChange={e => setQueryString(e.target.value)} value={queryString} />
      <Button type="submit" onClick={() => onSearch(queryString)}>
        Search
      </Button>
    </div>
  )
}

export default QueryInput
