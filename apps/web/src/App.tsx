import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';

export function App() {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-sm font-medium text-amber-200"
        >
          Sem conexão: somente leitura
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">InfoSys</h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Gestão operacional para prestadores de serviço técnico: agenda, clientes, orçamentos e
          manutenção recorrente.
        </p>
      </main>
    </div>
  );
}

export default App;
