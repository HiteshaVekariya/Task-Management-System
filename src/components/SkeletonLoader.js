import React from 'react';

const SkeletonLoader = ({ count, rowHeight = 20 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div className='mb-2'>
        <tr key={index} className="skeleton-row">
          <td style={{ height: `${rowHeight}px` }} className="bg-gray-300 animate-pulse w-full" />
          <td style={{ height: `${rowHeight}px` }} className="bg-gray-300 animate-pulse w-full" />
          <td style={{ height: `${rowHeight}px` }} className="bg-gray-300 animate-pulse w-full" />
          <td style={{ height: `${rowHeight}px` }} className="bg-gray-300 animate-pulse w-full" />
          <td style={{ height: `${rowHeight}px` }} className="bg-gray-300 animate-pulse w-full" />
        </tr>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
