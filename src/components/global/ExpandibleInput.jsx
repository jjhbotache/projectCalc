import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ExpandibleInput({ value, onChange, ...props }) {
  const divRef = useRef(null);

  return (
    <div
      ref={divRef}
      className='group'
    >
      <Textarea
        value={value}
        onChange={onChange}
        className="hidden group-focus-within:block group-hover:block w-full md:px-2 py-2 border md:rounded-md bg-white dark:bg-gray-700 dark:text-white"
        {...props}
      />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        className="block group-focus-within:hidden group-hover:hidden w-full md:px-2 py-2 border md:rounded-md bg-white dark:bg-gray-700 dark:text-white"
        {...props}
      />
    </div>
  );
};
