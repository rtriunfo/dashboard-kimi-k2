import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  // Render tests with minimal props
  it('renders with minimal props', () => {
    render(<EmptyState message="Test message" />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies default className when none provided', () => {
    render(<EmptyState message="Test message" />);
    
    const element = screen.getByText('Test message');
    expect(element).toHaveClass('text-center', 'py-8', 'text-slate-400');
  });

  it('applies custom className when provided', () => {
    render(
      <EmptyState 
        message="Test message" 
        className="custom-class text-red-500" 
      />
    );
    
    const element = screen.getByText('Test message');
    expect(element).toHaveClass('custom-class', 'text-red-500');
    expect(element).not.toHaveClass('text-center', 'py-8', 'text-slate-400');
  });

  // Edge case coverage for different prop values
  it('handles empty message', () => {
    render(<EmptyState message="" />);
    
    const element = screen.getByText('');
    expect(element).toBeInTheDocument();
  });

  it('handles long message', () => {
    const longMessage = 'This is a very long message that might wrap to multiple lines and should still be displayed correctly in the empty state component';
    render(<EmptyState message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles message with special characters', () => {
    const specialMessage = 'Message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<EmptyState message={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('handles message with HTML entities', () => {
    const htmlMessage = 'Message with &lt;HTML&gt; entities &amp; symbols';
    render(<EmptyState message={htmlMessage} />);
    
    expect(screen.getByText(htmlMessage)).toBeInTheDocument();
  });

  // Accessibility checks
  it('renders as a div element', () => {
    render(<EmptyState message="Test message" />);
    
    const element = screen.getByText('Test message');
    expect(element.tagName).toBe('DIV');
  });

  it('preserves text content exactly as provided', () => {
    const message = 'Exact message content';
    render(<EmptyState message={message} />);
    
    const element = screen.getByText(message);
    expect(element.textContent).toBe(message);
  });

  // Test different use cases
  it('works for no data scenarios', () => {
    render(<EmptyState message="No test data available" />);
    
    expect(screen.getByText('No test data available')).toBeInTheDocument();
  });

  it('works for no results scenarios', () => {
    render(<EmptyState message="No request data available" />);
    
    expect(screen.getByText('No request data available')).toBeInTheDocument();
  });

  it('works for filtered results scenarios', () => {
    render(<EmptyState message="No requests match the selected filters" />);
    
    expect(screen.getByText('No requests match the selected filters')).toBeInTheDocument();
  });
});
