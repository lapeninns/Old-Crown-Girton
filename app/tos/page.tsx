/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import { CANCELLATION_POLICY, DEPOSIT_POLICY } from "@/lib/policies";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms of Service | ${config.appName}`,
  description: "Readable terms governing site use, enquiries and bookings for The Old Crown Girton.",
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="p-5">
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">Terms of Service</h1>
        <div className="leading-relaxed space-y-6 text-sm">
          <p><strong>Effective Date:</strong> <span>10 August 2025</span></p>
          <p>These Terms govern your use of this website (the “Site”) operated for <strong>The Old Crown Girton</strong> ("we", "us"). By accessing or using the Site you agree to these Terms. If you do not agree, discontinue use.</p>
          <h2 className="text-xl font-bold mt-4">1. Scope</h2>
          <p>Applies to browsing the Site, submitting enquiries, reservation requests, private hire/event enquiries and optional newsletter sign‑ups.</p>
          <h2 className="text-xl font-bold mt-4">2. Not Restaurant Contract</h2>
          <p>Content is informational. A confirmed booking / event agreement (verbal or written) forms the service arrangement. Menu items, prices and availability may change without notice.</p>
          <h2 className="text-xl font-bold mt-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate information in forms</li>
            <li>No unlawful, disruptive or automated scraping activities</li>
            <li>Do not misuse contact channels (spam / abusive language)</li>
          </ul>
          <h2 className="text-xl font-bold mt-4">4. Reservations & Enquiries</h2>
          <p>Submission does not guarantee fulfilment until confirmed by us (email / phone / on‑screen). We may decline or adjust requests (capacity, timing or operational reasons). <strong>Cancellation / No‑Show:</strong> {CANCELLATION_POLICY}</p>
          <h2 className="text-xl font-bold mt-4">5. Private Hire & Events</h2>
          <p>Additional terms (minimum spend, deposit, timings, music / equipment rules) may apply and will be communicated on confirmation. {DEPOSIT_POLICY}</p>
          <h2 className="text-xl font-bold mt-4">6. Intellectual Property</h2>
          <p>All Site text, structure, graphics, and branding are owned by or licensed to us. You may not reproduce or republish without permission except for limited personal, non‑commercial reference.</p>
          <h2 className="text-xl font-bold mt-4">7. Reviews & Feedback</h2>
          <p>By submitting optional feedback you grant us a non‑exclusive licence to display, reproduce or adapt it (may be anonymised) for promotional or improvement purposes.</p>
          <h2 className="text-xl font-bold mt-4">8. Third‑Party Links</h2>
          <p>Links to external services (maps, booking widgets, social platforms) are provided for convenience; we are not responsible for their content or policies.</p>
          <h2 className="text-xl font-bold mt-4">9. Privacy</h2>
          <p>See our <a href="/privacy-policy" className="underline">Privacy Policy</a> for data handling details.</p>
          <h2 className="text-xl font-bold mt-4">10. Liability</h2>
          <p>The Site is provided “as is.” To the extent permitted by law we exclude implied warranties and are not liable for indirect, incidental, or consequential loss from Site use. Nothing limits liability for fraud or personal injury caused by negligence.</p>
          <h2 className="text-xl font-bold mt-4">11. Changes</h2>
          <p>We may modify these Terms; updates will show a new Effective Date. Continued use = acceptance.</p>
          <h2 className="text-xl font-bold mt-4">12. Severability</h2>
          <p>If any provision is unenforceable the remainder remains effective.</p>
          <h2 className="text-xl font-bold mt-4">13. Governing Law</h2>
          <p>England & Wales law; courts of England & Wales have exclusive jurisdiction.</p>
          <h2 className="text-xl font-bold mt-4">14. Contact</h2>
          <p>Questions: <span>legal@oldcrowngirton.co.uk</span></p>
        </div>
      </div>
    </div>
  );
};

export default TOS;
