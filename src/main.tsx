import {createRoot} from 'react-dom/client';
import './index.css';
import { ErrorBoundary, ErrorView } from './components/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);

// Carga la aplicación; si falla al importarse, muestra el error en pantalla
import('./App.tsx')
  .then(({ default: App }) => {
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  })
  .catch((err: unknown) => {
    root.render(<ErrorView message={err instanceof Error ? err.message : String(err)} />);
  });
