import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<string, string> = {
  primary:   'bg-[#1e3a8a] text-white hover:bg-[#1e40af] focus:ring-[#1e3a8a]',
  secondary: 'bg-[#166534] text-white hover:bg-[#15803d] focus:ring-[#166534]',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  ghost:     'bg-transparent text-[#1e3a8a] hover:bg-blue-50 focus:ring-[#1e3a8a]',
  outline:   'border border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 focus:ring-[#1e3a8a]',
};

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
