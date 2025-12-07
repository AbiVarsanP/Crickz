import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
import FuturisticLayout from '@/components/layout/FuturisticLayout';

export default function NotFound() {
  return (
    <FuturisticLayout connected={false}>
      <PageMeta title="Page Not Found" description="" />
      <div className="relative flex flex-col items-center justify-center h-full min-h-0 p-6 overflow-hidden z-1">
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-white text-title-md xl:text-title-2xl">ERROR</h1>

          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-slate-300 sm:text-lg">
            The page may have been deleted or does not exist. Please check the
            URL is correct.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-transparent px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-white/[0.02]"
          >
            Back to home
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-slate-400 -translate-x-1/2 bottom-6 left-1/2">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </FuturisticLayout>
  );
}
