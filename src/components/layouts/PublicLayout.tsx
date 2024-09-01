import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationLogo, Footer } from '@/components';
import useAuth from '@/hooks/useAuth';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return !isAuthenticated ? (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="w-full h-max pt-3 sm:pt-16 sm:pb-6">
        <div className="flex justify-center mb-8">
          <ApplicationLogo />
        </div>
        <div className="flex flex-col items-center">
          {children}
          <Footer className='mt-6 !p-0' />
        </div>
      </div>
    </div>
  ) : null;
};

export default PublicLayout;
