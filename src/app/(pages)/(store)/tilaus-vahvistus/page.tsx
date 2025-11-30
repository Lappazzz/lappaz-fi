'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const authorizationToken = searchParams.get('authorization_token');

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Kiitos tilauksestasi!</h1>

      <p className="text-gray-700 mb-4">
        Tilaus on vastaanotettu ja käsittelemme sen mahdollisimman pian.
      </p>

      {orderId && (
        <div className="mb-6 rounded-md border bg-green-50 px-4 py-3 text-sm text-green-800">
          <p>
            <span className="font-semibold">Tilausnumero:</span>{' '}
            <span>{orderId}</span>
          </p>
        </div>
      )}

      {!orderId && authorizationToken && (
        <div className="mb-6 rounded-md border bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <p className="font-semibold mb-1">
            Maksu vahvistettu Klarnassa.
          </p>
          <p>
            Valtuutustunnus (authorization_token):{' '}
            <span className="break-all">{authorizationToken}</span>
          </p>
        </div>
      )}

      {!orderId && !authorizationToken && (
        <div className="mb-6 rounded-md border bg-gray-50 px-4 py-3 text-sm text-gray-800">
          <p>
            Emme löytäneet tilausnumeroa, mutta mikäli maksu
            onnistui, saat erillisen vahvistusviestin sähköpostiisi.
          </p>
        </div>
      )}

      <section className="mt-6 space-y-2 text-gray-700 text-sm">
        <p>
          Tilauksesi yhteenveto on lähetetty antamaasi sähköpostiosoitteeseen.
        </p>
        <p>
          Jos jokin tuntuu oudolta tai et saanut vahvistussähköpostia, voit
          olla yhteydessä asiakaspalveluun.
        </p>
      </section>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-block rounded-md bg-black px-6 py-2 text-white hover:bg-gray-900"
        >
          Palaa etusivulle
        </Link>
      </div>
    </main>
  );
}
