import Link from 'next/link';

type Debt = {
  id: string;
  name: string;
  email: string;
  debtSubject: string;
  debtAmount: number;
  status: string;
  paidAt?: string | null;
};

function getApiBaseUrl() {
  return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

async function fetchDebts(): Promise<Debt[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/debts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch debts');
  return res.json();
}

export default async function DebtList() {
  const debts = await fetchDebts();

  return <DebtTable debts={debts} />;
}

function DebtTable({ debts }: { debts: Debt[] }) {
  return (
    <main style={{ maxWidth: 960, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ marginBottom: 8 }}>Liste des dettes</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>Cliquez sur une ligne pour voir le détail et payer.</p>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Nom</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Objet</th>
              <th style={{ padding: '12px 16px' }}>Montant (€)</th>
              <th style={{ padding: '12px 16px' }}>Statut</th>
              <th style={{ padding: '12px 16px' }}>Payé le</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((debt) => (
              <tr
                key={debt.id}
                className="clickable-row"
                style={{
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                <td style={{ padding: 0 }}>
                  <Link
                    href={`/debts/${debt.id}`}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#0f172a',
                      fontWeight: 600
                    }}
                  >
                    {debt.name}
                  </Link>
                </td>
                <td style={{ padding: 0 }}>
                  <Link
                    href={`/debts/${debt.id}`}
                    style={{ display: 'block', padding: '12px 16px', color: '#475569' }}
                  >
                    {debt.email}
                  </Link>
                </td>
                <td style={{ padding: 0 }}>
                  <Link href={`/debts/${debt.id}`} style={{ display: 'block', padding: '12px 16px' }}>
                    {debt.debtSubject}
                  </Link>
                </td>
                <td style={{ padding: 0 }}>
                  <Link href={`/debts/${debt.id}`} style={{ display: 'block', padding: '12px 16px' }}>
                    {debt.debtAmount.toFixed(2)}
                  </Link>
                </td>
                <td style={{ padding: 0 }}>
                  <Link href={`/debts/${debt.id}`} style={{ display: 'block', padding: '12px 16px' }}>
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
                  </Link>
                </td>
                <td style={{ padding: 0 }}>
                  <Link href={`/debts/${debt.id}`} style={{ display: 'block', padding: '12px 16px', color: '#475569' }}>
                    {debt.paidAt && debt.status === 'PAID'
                      ? new Date(debt.paidAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
