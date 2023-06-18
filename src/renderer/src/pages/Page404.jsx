import { memo } from 'react'

const Page404 = () => {
  const Dismiss = () => {
    window.history.go(-1)
    /*same as function
     *history.back() */
  }
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <main className="h-screen w-full flex flex-col justify-center items-center bg-gray-300 dark:bg-[#1A2238]">
        <h1 className="text-9xl font-extrabold text-[#1A2238] dark:text-white tracking-widest">
          {'404'}
        </h1>
        <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute text-gray-800 dark:text-slate-50">
          {'Not Found'}
        </div>
        <div className="mt-5 outline-none">
          <button
            onClick={Dismiss}
            className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none"
          >
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
              {'Go Back'}
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default memo(Page404)
