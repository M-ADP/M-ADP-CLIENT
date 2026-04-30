interface ComingSoonPageProps {
  featureName: string;
}

export default function ComingSoonPage({ featureName }: ComingSoonPageProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 700,
            color: '#111827',
          }}
        >
          {featureName}
        </h1>
        <p
          style={{
            margin: '12px 0 0',
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#4b5563',
          }}
        >
          현재 준비중인 기능입니다.
        </p>
      </section>
    </main>
  );
}
