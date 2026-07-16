'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Meta Pixel: PageView global + captura de UTMs de llegada en sessionStorage. */
export default function MetaPixel() {
  const pathname = usePathname();
  const cargado = useRef(false);

  useEffect(() => {
    // Captura de UTMs una sola vez por sesión
    try {
      const params = new URLSearchParams(window.location.search);
      const utms: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        const v = params.get(k);
        if (v) utms[k] = v;
      });
      if (Object.keys(utms).length > 0 && !sessionStorage.getItem('nanitos_utm')) {
        sessionStorage.setItem('nanitos_utm', JSON.stringify(utms));
      }
    } catch {
      // sessionStorage puede no estar disponible
    }
  }, []);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (!cargado.current) {
      cargado.current = true;
      return; // el PageView inicial lo dispara el snippet
    }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
