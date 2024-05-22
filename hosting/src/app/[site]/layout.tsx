'use client';

import Loader from '@/components/common/Loader';
import '@/css/satoshi.css';
import '@/css/style.css';
import {useTanamSite} from '@/hooks/useTanamSite';
import 'flatpickr/dist/flatpickr.min.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({children}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const site = pathname.split('/')[1];
  // TODO(Dennis): Fix cases if URL parameter is not a valid site ID
  // See: https://github.com/oddbit/tanam/issues/347
  const {getSite} = useTanamSite(site ?? 'foo');

  useEffect(() => {
    getSite().then((data) => {
      document.title = data?.title ?? 'Tanam';
      setLoading(false);
    });
  }, [getSite, site, router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">{loading ? <Loader /> : children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
