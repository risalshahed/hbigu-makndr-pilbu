'use client'

import { useState } from "react";
import MarkdownRenderer from "./MarkDownRenderer";

export default function PublishGrid({ contents }) {
  const [colCount, setColCount] = useState(3);

  const handleChange = (e) => {
    setColCount(Number(e.target.value));
  };

  let colClass;
  let maxWidth;
  switch (colCount) {
    case 4:
      colClass = 'lg:grid-cols-4';
      maxWidth = 'max-w-[1150px]';
      break;
    case 5:
      colClass = 'lg:grid-cols-5';
      maxWidth = 'max-w-[1280px]';
      break;
      default:
        colClass = 'lg:grid-cols-3';
        maxWidth = 'max-w-[1024px]';
  }

  return (
    <>
      <div className="flex justify-center items-center pb-12">
        <label className="mr-3 font-medium">
          Show <strong>{colCount}</strong> Markdowns Per Row
        </label>
        <select
          value={colCount}
          onChange={handleChange}
          className="border rounded px-3 py-1 cursor-pointer"
        >
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div className={`boxShadow ${maxWidth} mx-auto grid grid-cols-1 md:grid-cols-2 ${colClass} gap-x-2 sm:gap-x-4 md:gap-x-8 gap-y-7`}>
        {contents.map(c =>
          <div key={c.name}>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <MarkdownRenderer content={c.content} />
          </div>
        )}
      </div>
    </>
  )
}
