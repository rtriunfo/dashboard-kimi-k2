import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeverityBadge from './SeverityBadge';

describe('SeverityBadge', () => {
  it('renders with severity text', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('applies correct styling for BLOCKER severity', () => {
    render(<SeverityBadge severity="BLOCKER" />);
    const badge = screen.getByText('BLOCKER');
    expect(badge).toHaveClass('bg-[#ef4444]', 'text-white');
  });

  it('applies correct styling for CRITICAL severity', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toHaveClass('bg-[#f97316]', 'text-white');
  });

  it('applies correct styling for MAJOR severity', () => {
    render(<SeverityBadge severity="MAJOR" />);
    const badge = screen.getByText('MAJOR');
    expect(badge).toHaveClass('bg-[#eab308]', 'text-white');
  });

  it('applies correct styling for MINOR severity', () => {
    render(<SeverityBadge severity="MINOR" />);
    const badge = screen.getByText('MINOR');
    expect(badge).toHaveClass('bg-[#3b82f6]', 'text-white');
  });

  it('applies correct styling for NONE severity', () => {
    render(<SeverityBadge severity="NONE" />);
    const badge = screen.getByText('NONE');
    expect(badge).toHaveClass('bg-[#10b981]', 'text-white');
  });

  it('applies default styling for unknown severity', () => {
    render(<SeverityBadge severity="UNKNOWN_SEVERITY" />);
    const badge = screen.getByText('UNKNOWN_SEVERITY');
    expect(badge).toHaveClass('bg-gray-400', 'text-white');
  });

  it('handles case insensitive severity values', () => {
    render(<SeverityBadge severity="critical" />);
    const badge = screen.getByText('critical');
    expect(badge).toHaveClass('bg-[#f97316]', 'text-white');
  });

  it('displays UNKNOWN for empty severity', () => {
    render(<SeverityBadge severity="" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('displays UNKNOWN for null severity', () => {
    render(<SeverityBadge severity={null as any} />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('displays UNKNOWN for undefined severity', () => {
    render(<SeverityBadge severity={undefined as any} />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('applies base styling classes', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toHaveClass('px-2', 'py-1', 'rounded-full', 'text-xs', 'font-medium');
  });

  it('renders as a span element', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge.tagName).toBe('SPAN');
  });
});
