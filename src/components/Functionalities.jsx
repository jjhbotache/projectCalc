import { useState } from 'react';
import Function from './Functionality';

export default function Functionalities({ functionalities }) {
  const [expandedFunctionalityId, setExpandedFunctionalityId] = useState(null);
  return (
    <div className='flex flex-col gap-8 w-full my-4'>
      {functionalities.map((functionality) => (
        <Function
          key={functionality.id}
          functionality={functionality}
          isCollapsed={expandedFunctionalityId !== functionality.id}
          onToggle={() => {
            setExpandedFunctionalityId(
              expandedFunctionalityId === functionality.id ? null : functionality.id
            );
          }}
        />
      ))}
    </div>
  );
}
