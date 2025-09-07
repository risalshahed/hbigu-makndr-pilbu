'use client'

import { useMemo, useState } from "react";
import MarkdownRenderer from "./MarkDownRenderer";
import Link from "next/link";

export default function PublishGrid({ contents }) {
  const [colCount, setColCount] = useState(3);
  const [sortOption, setSortOption] = useState("time-desc");

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
    case 6:
      colClass = 'lg:grid-cols-6';
      maxWidth = 'max-w-[1400px]';
      break;
      default:
        colClass = 'lg:grid-cols-3';
        maxWidth = 'max-w-[1024px]';
  }

  const handleChangeSort = e => setSortOption(e.target.value);

  const sortedContents = useMemo(() => {
    const sorted = [...contents];
    switch (sortOption) {
      case "title-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "title-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "time-asc":
        return sorted.sort((a, b) => new Date(a.lastModified) - new Date(b.lastModified));
      case "time-desc":
      default:
        return sorted.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    }
  }, [contents, sortOption]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <h2 className="text-xl sm:text-2xl font-bold">
          Wanna Manage Drafts?
        </h2>
        <Link href='/drafts'>
          <button className='bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded'>
            Click Here
          </button>
        </Link>
      </div>
      {/* Column selector */}
      <div className='max-w-[992px] mx-auto flex gap-x-5 justify-around items-center pt-8 pb-6'>
        <div className="hidden lg:flex justify-center items-center text-lg">
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
            <option value={6}>6</option>
          </select>
        </div>
        {/* Sort selector */}
        <div>
          <label className="mr-3 font-medium">Sort By:</label>
          <select
            value={sortOption}
            onChange={handleChangeSort}
            className="border rounded px-3 py-1 cursor-pointer"
          >
            <option value="time-desc">Latest Publishes</option>
            <option value="time-asc">Oldest Publishes</option>
            <option value="title-asc">Title (A → Z)</option>
            <option value="title-desc">Title (Z → A)</option>
          </select>
        </div>

      </div>
      {/* contents */}
      <div className={`${maxWidth} mx-auto grid grid-cols-1 md:grid-cols-2 ${colClass} gap-x-2 sm:gap-x-4 md:gap-x-8 gap-y-4 sm:gap-y-7 px-2 sm:px-4 w-full sm:w-3/4 md:w-full py-8`}>
        {sortedContents.map(c =>
          <div key={c.name} className="boxShadow">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <MarkdownRenderer content={c.content} />
          </div>
        )}
      </div>
    </>
  )
}
