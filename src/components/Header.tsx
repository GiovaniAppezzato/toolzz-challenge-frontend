import { Fragment, useState } from "react"
import Link from "next/link"
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ApplicationLogo, DropdownHeader } from "@/components";
import brSvg from "@/assets/images/flags/br.svg"
import usSvg from "@/assets/images/flags/us.svg"

export default function Header({ title }: { title?: string }) {
  const [language] = useState(localStorage.getItem('@toolzz:language'));
  const [theme] = useState(localStorage.getItem('@toolzz:theme'));

  function handleChangeLanguage() {
    const newLanguage = language === 'en' ? 'pt' : 'en';
    localStorage.setItem('@toolzz:language', newLanguage);
    window.location.reload();
  }

  function handleChangeTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('@toolzz:theme', newTheme);
    window.location.reload();
  }

  return (
    <Fragment>
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="shrink-0 flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-6 w-auto fill-current text-gray-800" />
              </Link>
            </div>

            <div className="flex items-center gap-1 ms-6">
              <button className="p-2 flex items-center rounded-full  hover:bg-gray-100 focus:outline-none focus:bg-gray-200" onClick={handleChangeLanguage}>
                <img className="w-6 h-6 rounded-md" src={language === 'en' ? usSvg.src : brSvg.src} alt="flag" />
              </button>
              {/* <button className="p-2 flex items-center rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-200" onClick={handleChangeTheme}>
                {theme !== 'light' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
              </button> */}
              <DropdownHeader />
            </div>
          </div>
        </div>
      </nav>
      {title && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-lg text-gray-800 leading-tight">{title}</h2>
          </div>
        </header>
      )}
    </Fragment>
  )
}
