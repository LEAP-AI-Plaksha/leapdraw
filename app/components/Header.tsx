import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="flex flex-col bg-black pt-8 px-5">
       <div className="flex flex-row justify-center ">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img src="/backbutton.svg" alt="Back" className="w-12 h-12" />
            <span className="ml-2 text-white text-xl font-medium font-instrumentSans">
              leave
            </span>
          </div>
        </Link>
        <span className="text-4xl text-white font-bold font-londrinaShadow flex-1 text-right">
          LEAP
        </span>
      </div>
    </div>
  )
}

export default Header
