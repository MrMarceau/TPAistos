import Link from 'next/link';

type Debt = {
  id: string;
  name: string;
  email: string;
  debtSubject: string;
  debtAmount: number;
  status: string;
};

function getApiBaseUrl() {
  return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

async function fetchDebt(id: string): Promise<Debt> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/debts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch debt');
  }
  return res.json();
}

export default async function DebtDetailPage({ params }: { params: { id: string } }) {
  const debt = await fetchDebt(params.id);

  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 24px' }}>
      <Link href="/debts" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
        ← Retour à la liste
      </Link>
      <h1 style={{ margin: '12px 0 8px' }}>{debt.debtSubject}</h1>
      <p style={{ margin: 0, color: '#475569' }}>
        {debt.name} — {debt.email}
      </p>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#475569' }}>Nom</span>
          <span style={{ fontWeight: 600 }}>{debt.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#475569' }}>Email</span>
          <span style={{ fontWeight: 600 }}>{debt.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#475569' }}>Objet</span>
          <span style={{ fontWeight: 600 }}>{debt.debtSubject}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#475569' }}>Montant</span>
          <strong style={{ fontSize: 18 }}>{debt.debtAmount.toFixed(2)} €</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#475569' }}>Statut</span>
          <span
            style={{
              background: debt.status === 'PAID' ? '#dcfce7' : '#fef9c3',
              color: debt.status === 'PAID' ? '#166534' : '#854d0e',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {debt.status}
          </span>
        </div>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '12px 16px',
            marginTop: 12,
            borderRadius: 10,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            opacity: debt.status === 'PAID' ? 0.5 : 1
          }}
          disabled={debt.status === 'PAID'}
        >
          Payer
        </button>
      </div>
    </main>
  );
}
