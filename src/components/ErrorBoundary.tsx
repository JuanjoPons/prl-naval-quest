import React from 'react';

/** Muestra el error en pantalla en lugar de dejarla en blanco. */
export function ErrorView({ message }: { message: string }) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: '#fecaca', background: '#0f172a', minHeight: '100vh' }}>
      <h2 style={{ color: '#fca5a5', fontWeight: 700 }}>Se ha producido un error al cargar el juego</h2>
      <p style={{ color: '#cbd5e1' }}>Haz una captura de esta pantalla y envíasela a Claude.</p>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#1e293b', padding: 12, borderRadius: 8 }}>{message}</pre>
    </div>
  );
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.error) return <ErrorView message={this.state.error.message} />;
    return this.props.children;
  }
}
