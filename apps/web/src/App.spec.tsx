import { act, render, screen } from '@testing-library/react';
import { App } from './App';

describe('RF-PLT-001 · PWA e modo somente leitura offline (ADR-0009)', () => {
  it('renderiza o cabeçalho principal do InfoSys', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /infosys/i })).toBeInTheDocument();
  });

  it('exibe o aviso "Sem conexão: somente leitura" quando o navegador fica offline', () => {
    render(<App />);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByRole('status')).toHaveTextContent(/sem conexão: somente leitura/i);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
  });
});
