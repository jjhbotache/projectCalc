import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ExpandibleInput({ value, onChange, ...props }) {
  const inputRef = useRef(null);
  const [necessaryToExpand, setNecessaryToExpand] = useState(false);
  useEffect(() => {
    checkNecessaryToExpand();
  }, []);
  
  const checkNecessaryToExpand = () => {
    const input = inputRef.current;
    setNecessaryToExpand(input.scrollWidth > input.clientWidth);
  }
  
  return (
    <div
      className='group w-full'
    >
      <Textarea
        value={value}
        onChange={onChange}
        className={`hidden ${necessaryToExpand && "group-focus-within:block group-hover:block"}  w-full md:px-2 py-2 border md:rounded-md dark:bg-opacity-5 bg-opacity-5  bg-black dark:bg-white dark:text-white`}
        onBlur={checkNecessaryToExpand}
        rows={2}
        {...props}
      />
      <Input
        ref={inputRef}  
        type="text"
        value={value}
        onChange={onChange}
        onBlur={checkNecessaryToExpand}
        className={`block ${necessaryToExpand && "group-focus-within:hidden group-hover:hidden"}  w-full md:px-2 py-2 border md:rounded-md dark:bg-opacity-5 bg-opacity-5  bg-black dark:bg-white dark:text-white`}
        {...props}
      />
    </div>
  );
};
