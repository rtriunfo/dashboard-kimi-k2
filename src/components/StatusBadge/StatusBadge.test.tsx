import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  describe('Basic rendering', () => {
    it('renders with default props', () => {
      render(<StatusBadge status="pass" />);
      expect(screen.getByText('pass')).toBeInTheDocument();
    });

    it('renders with custom status text', () => {
      render(<StatusBadge status="custom-status" />);
      expect(screen.getByText('custom-status')).toBeInTheDocument();
    });
  });

  describe('Status colors', () => {
    it('applies green background for pass status', () => {
      render(<StatusBadge status="pass" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass('bg-green-500');
    });

    it('applies red background for fail status', () => {
      render(<StatusBadge status="fail" />);
      const badge = screen.getByText('fail');
      expect(badge).toHaveClass('bg-red-500');
    });

    it('applies gray background for unknown status', () => {
      render(<StatusBadge status="unknown" />);
      const badge = screen.getByText('unknown');
      expect(badge).toHaveClass('bg-gray-500');
    });

    it('handles case insensitive status matching', () => {
      render(<StatusBadge status="PASS" />);
      const badge = screen.getByText('PASS');
      expect(badge).toHaveClass('bg-green-500');
    });
  });

  describe('Size variants', () => {
    it('applies small size classes by default', () => {
      render(<StatusBadge status="pass" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('applies large size classes when size is lg', () => {
      render(<StatusBadge status="pass" size="lg" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('uses inline-flex for small size', () => {
      render(<StatusBadge status="pass" size="sm" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass('inline-flex');
    });

    it('uses flex for large size', () => {
      render(<StatusBadge status="pass" size="lg" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass('flex');
    });
  });

  describe('Icon functionality', () => {
    it('does not show icon by default', () => {
      render(<StatusBadge status="pass" />);
      const badge = screen.getByText('pass');
      expect(badge.querySelector('svg')).not.toBeInTheDocument();
    });

    it('shows CheckCircle icon for pass status when showIcon is true', () => {
      render(<StatusBadge status="pass" showIcon />);
      const badge = screen.getByText('pass');
      expect(badge.querySelector('svg')).toBeInTheDocument();
    });

    it('shows XCircle icon for fail status when showIcon is true', () => {
      render(<StatusBadge status="fail" showIcon />);
      const badge = screen.getByText('fail');
      expect(badge.querySelector('svg')).toBeInTheDocument();
    });

    it('shows AlertTriangle icon for unknown status when showIcon is true', () => {
      render(<StatusBadge status="unknown" showIcon />);
      const badge = screen.getByText('unknown');
      expect(badge.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct icon size for small badge', () => {
      render(<StatusBadge status="pass" showIcon size="sm" />);
      const icon = screen.getByText('pass').querySelector('svg');
      expect(icon).toHaveClass('w-4', 'h-4');
    });

    it('applies correct icon size for large badge', () => {
      render(<StatusBadge status="pass" showIcon size="lg" />);
      const icon = screen.getByText('pass').querySelector('svg');
      expect(icon).toHaveClass('w-5', 'h-5');
    });
  });

  describe('Common CSS classes', () => {
    it('always applies base styling classes', () => {
      render(<StatusBadge status="pass" />);
      const badge = screen.getByText('pass');
      expect(badge).toHaveClass(
        'font-semibold',
        'text-white',
        'rounded-full',
        'items-center',
        'justify-center',
        'gap-2'
      );
    });
  });

  describe('Edge cases', () => {
    it('handles empty status string', () => {
      const { container } = render(<StatusBadge status="" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-gray-500');
    });

    it('handles mixed case status', () => {
      render(<StatusBadge status="FaIl" />);
      const badge = screen.getByText('FaIl');
      expect(badge).toHaveClass('bg-red-500');
    });
  });
});
