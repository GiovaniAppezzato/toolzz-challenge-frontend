import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { ApplicationLogo, Footer } from '@/components';
import useAuth from '@/hooks/useAuth';
import toolzzLg from '@/assets/images/toolzz-lg.png';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const theme = localStorage.getItem('@toolzz:theme');
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return !isAuthenticated ? (
    <>
      <Head>
        <title>Toolzz | Giovani Appezzato</title>
        <meta property="og:title" content="Toolzz" key="title" />
      </Head>
      <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="w-full h-max pt-3 sm:pt-16 sm:pb-6">
          <div className="flex justify-center mb-8">
            {theme !== 'dark' ? <ApplicationLogo src={toolzzLg} className='w-48' /> : <ApplicationLogo className='h-16 w-16' />}
          </div>
          <div className="flex flex-col items-center">
            {children}
            <Footer className='mt-6 !p-0' />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default PublicLayout;
