"use client";

import { useEffect, useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

type Props = {
  debtId: string;
  status: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export function PaymentBox({ debtId, status }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    if (currentStatus === 'PAID') return;
    const fetchIntent = async () => {
      try {
        setFetching(true);
        setError(null);
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/debts/${debtId}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          throw new Error('Impossible de créer le paiement');
        }
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur paiement');
      } finally {
        setFetching(false);
      }
    };
    fetchIntent();
  }, [debtId, currentStatus]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : undefined),
    [clientSecret]
  );

  if (currentStatus === 'PAID') {
    return (
      <div style={{ marginTop: 16, color: '#166534', fontWeight: 600 }}>
        Dette déjà payée — merci !
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {error && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>}
      {fetching && !clientSecret ? <div>Initialisation du paiement...</div> : null}
      {clientSecret && options && stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm debtId={debtId} onPaid={() => setCurrentStatus('PAID')} />
        </Elements>
      )}
    </div>
  );
}

async function fetchDebtStatus(debtId: string) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/debts/${debtId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch debt status');
  const debt = await res.json();
  return debt.status as string;
}

function PaymentForm({ debtId, onPaid }: { debtId: string; onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href
        },
        redirect: 'if_required'
      });

      if (error) {
        setMessage(error.message || 'Le paiement a échoué');
      } else {
        setMessage('Paiement confirmé ou en cours...');
        // Poll quelques secondes pour laisser le webhook marquer la dette comme payée
        const attempts = 6;
        for (let i = 0; i < attempts; i++) {
          try {
            const status = await fetchDebtStatus(debtId);
            if (status === 'PAID') {
              onPaid();
              router.refresh();
              setMessage('Paiement confirmé. Statut mis à jour.');
              break;
            }
          } catch (err) {
            // on ignore les erreurs ponctuelles et on retente
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
        <PaymentElement />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || submitting}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 10,
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          fontWeight: 700,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.7 : 1
        }}
      >
        {submitting ? 'Paiement en cours...' : 'Payer'}
      </button>
      {message && <div style={{ marginTop: 10, color: '#0f172a' }}>{message}</div>}
    </div>
  );
}
