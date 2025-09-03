import Link from '@/lib/debugLink';

export default function PrivacyHero() {
  return (
    <div className="oc-container oc-content">
      <div className="px-5 py-4 sm:py-6">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold pt-3 sm:pt-4">Privacy Policy</h1>
      </div>
    </div>
  );
}
