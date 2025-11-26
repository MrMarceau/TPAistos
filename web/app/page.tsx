export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ marginBottom: 12 }}>TPAistos</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Boilerplate Next.js + NestJS + Postgres. La page débiteur et le flux Stripe viendront ensuite.
      </p>
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
        }}
      >
        <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
          <li>Next.js 14 (app router)</li>
          <li>NestJS API (port 3001)</li>
          <li>Postgres + Adminer via docker-compose</li>
        </ul>
      </div>
    </main>
  );
}
