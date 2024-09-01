import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';
import toolzzLg from '@/assets/images/toolzz-lg.png';
import { Spinner } from '@/components';

export default function AppLoader({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const { i18n } = useTranslation();

  const { checkAuthentication } = useAuth();

  useEffect(() => {
    async function loadApplication() {
      try {
        await checkAuthentication();

        // Check if the current language is set.
        checkIfLanguageIsSet();

        // Check if the current theme is set.
        checkIfThemeIsSet();
      } catch (error) {
        localStorage.removeItem('@toolzz:accessToken');
      } finally {
        setLoaded(true);
      }
    } 

    loadApplication();
  }, []);

  function checkIfLanguageIsSet() {
    let language = localStorage.getItem('@toolzz:language');

    if(!language) {
      localStorage.setItem('@toolzz:language', 'pt');
      language = 'pt';
    }

    i18n.changeLanguage(language);
  }

  function checkIfThemeIsSet() {
    let theme = localStorage.getItem('@toolzz:theme');

    if(!theme) {
      localStorage.setItem('@toolzz:theme', 'light');
    }

    if(theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  if(loaded) {
    return children;
  }

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      <Image src={toolzzLg} className='w-64' alt="Application Logo" />
      <Spinner className="h-7 w-7 text-gray-400" />
    </div>
  );
}
