import { Wrench } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export default function AdminPlaceholderPage({ title, description }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-[#1e3a8a]" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">
          {description ?? 'This admin module is being built. Connect Firebase to enable full functionality.'}
        </p>
      </div>
    </div>
  );
}
