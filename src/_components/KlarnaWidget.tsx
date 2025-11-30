'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface KlarnaAuthorizeResult {
    approved: boolean;
    authorization_token?: string;
  }

  interface KlarnaPayments {
    init(config: { client_token: string }): void;
    load(
      config: { container: string },
      callback: (res: { show_form?: boolean } | null) => void
    ): void;
    authorize(
      data: Record<string, unknown>,
      callback: (res: KlarnaAuthorizeResult | null) => void
    ): void;
  }

  interface KlarnaGlobal {
    Payments: KlarnaPayments;
  }

  interface Window {
    Klarna?: KlarnaGlobal;
  }
}

type KlarnaCartItemPayload = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

type KlarnaCustomerPayload = {
  name: string;
  address: string;
  city: string;
  postal: string;
  email: string;
  phone: string;
};

type KlarnaPayload = {
  items: KlarnaCartItemPayload[];
  customer: KlarnaCustomerPayload;
  // vatRatePercent poistettu – ALV 25,5 % kovakoodattu backendissä
};

type KlarnaWidgetProps = {
  payload: KlarnaPayload;
  onSuccess: (orderId: string) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
};

type KlarnaSessionResponse = {
  client_token?: string;
  session_id?: string;
  error?: string;
};

type KlarnaOrderResponse = {
  order_id?: string;
  error?: string;
};

export default function KlarnaWidget({
  payload,
  onSuccess,
  onError,
  disabled = false,
}: KlarnaWidgetProps) {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Load Klarna JS
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
    script.async = true;
    script.onload = () => {
      // script loaded
    };
    script.onerror = () => onError('Klarna SDK:n lataus epäonnistui');
    document.body.appendChild(script);
  }, [onError]);

  // Create KP session
  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await fetch('/api/klarna/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as KlarnaSessionResponse;

        if (!res.ok || !data.client_token) {
          const errorMessage = data.error || 'Session error';
          throw new Error(errorMessage);
        }

        setClientToken(data.client_token);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Session error';
        onError(message);
      }
    };

    // jos ei tuotteita, ei yritetä luoda sessiota
    if (!payload.items || payload.items.length === 0) {
      setClientToken(null);
      return;
    }

    createSession();
  }, [payload, onError]);

  // Init + load payment form
  useEffect(() => {
    if (!clientToken || typeof window === 'undefined' || !window.Klarna) {
      return;
    }

    try {
      window.Klarna.Payments.init({ client_token: clientToken });

      window.Klarna.Payments.load(
        { container: '#klarna-payments-container' },
        (res) => {
          if (!res || res.show_form !== true) {
            onError('Klarna-maksulomaketta ei voitu ladata');
          }
        }
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Init error';
      onError(message);
    }
  }, [clientToken, onError]);

  const handlePay = async () => {
    if (disabled) return;

    if (typeof window === 'undefined' || !window.Klarna) {
      onError('Klarna ei ole valmis');
      return;
    }

    setLoading(true);

    try {
      const authRes: KlarnaAuthorizeResult = await new Promise(
        (resolve, reject) => {
          window.Klarna?.Payments.authorize({}, (res) => {
            if (!res) {
              reject(new Error('Ei vastausta Klarna.authorize-kutsusta'));
              return;
            }
            resolve(res);
          });
        }
      );

      if (!authRes.approved || !authRes.authorization_token) {
        setLoading(false);
        onError('Maksua ei hyväksytty');
        return;
      }

      const finalizeRes = await fetch('/api/klarna/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorization_token: authRes.authorization_token,
          ...payload, // sisältää nyt vain items + customer
        }),
      });

      const data = (await finalizeRes.json()) as KlarnaOrderResponse;
      setLoading(false);

      if (!finalizeRes.ok || !data.order_id) {
        const errorMessage = data.error || 'Tilauksen luonti epäonnistui';
        onError(errorMessage);
        return;
      }

      onSuccess(data.order_id);
    } catch (err: unknown) {
      setLoading(false);
      const message =
        err instanceof Error ? err.message : 'Maksu epäonnistui';
      onError(message);
    }
  };

  return (
    <div className="space-y-3">
      <div
        id="klarna-payments-container"
        className="rounded border bg-white p-3"
      />
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !clientToken || disabled}
        className="w-full px-4 py-2 bg-black text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Käsitellään maksua...' : 'Maksa Klarnalla'}
      </button>
    </div>
  );
}
