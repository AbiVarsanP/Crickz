/**
 * Sample Page
 */

import PageMeta from '@/components/common/PageMeta';
import FuturisticLayout from '@/components/layout/FuturisticLayout';

export default function SamplePage() {
  return (
    <FuturisticLayout connected>
      <PageMeta title="Sample" description="Sample Page" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-semibold text-white">This is a sample page</h3>
        <p className="mt-4 text-slate-300">Use this page as a starting point for new routes.</p>
      </div>
    </FuturisticLayout>
  );
}
