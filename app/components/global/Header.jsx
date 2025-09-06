import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className='bg-black text-white px-4 sm:px-12'>
      <nav>
        <ul className='list-none p-4 flex gap-x-5 justify-end'>
          <li className='hover:text-yellow-500'>
            <Link href='/'>
              Home
            </Link>
          </li>
          <li className='hover:text-yellow-500'>
            <Link href='/drafts'>
              Manage Drafts
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}