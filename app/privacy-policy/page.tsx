import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  description: "Privacy policy for The Old Crown Girton outlining data handling for enquiries, bookings and site usage.",
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">Privacy Policy</h1>
        <div className="leading-relaxed space-y-6 text-sm">
          <p><strong>Effective Date:</strong> <span>10 August 2025</span></p>
          <p>We respect your privacy and handle personal information responsibly in line with applicable UK data protection laws (UK GDPR & Data Protection Act 2018). This policy explains what we collect, why we collect it, how it is used, and the rights available to you.</p>
          <h2 className="text-xl font-bold mt-4">1. Who We Are</h2>
          <p><strong>The Old Crown Girton</strong> – a historic thatched pub & Nepalese + British dining venue located in Girton, near Cambridge. References to "we" / "us" / "our" mean The Old Crown Girton.</p>
          <h2 className="text-xl font-bold mt-4">2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details: name, email, phone (when you enquire or book)</li>
            <li>Booking preferences: date, time, party size, special notes (e.g. dietary requirements)</li>
            <li>Event/private hire details: occasion type, approximate numbers, requested facilities</li>
            <li>Voluntary feedback: reviews, messages, survey responses</li>
            <li>Technical data: IP address, device/browser type, pages viewed (via analytics / logs) via Plausible (privacy-friendly, no cookies for core metrics)</li>
            <li>Cookie-related identifiers (see Section 8)</li>
          </ul>
          <h2 className="text-xl font-bold mt-4">3. How We Use Personal Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process table & event enquiries / confirmations</li>
            <li>Respond to questions & provide customer support</li>
            <li>Improve website content & user experience</li>
            <li>Send optional updates / newsletters (only with explicit consent)</li>
            <li>Maintain security & prevent misuse</li>
            <li>Comply with legal obligations (e.g. safety or regulatory queries)</li>
          </ul>
          <h2 className="text-xl font-bold mt-4">4. Legal Bases for Processing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contract:</strong> handling your reservation / hire enquiry</li>
            <li><strong>Legitimate Interests:</strong> running and improving our business & site</li>
            <li><strong>Consent:</strong> marketing communications (you can withdraw any time)</li>
            <li><strong>Legal Obligation:</strong> safety, compliance & record keeping</li>
          </ul>
          <h2 className="text-xl font-bold mt-4">5. Sharing & Disclosure</h2>
          <p>We do not sell your data. Limited sharing occurs with trusted service providers strictly for operational purposes (e.g. booking / hosting platform, email service) under appropriate safeguards. We may disclose data if required by law or to protect our legal rights.</p>
          <h2 className="text-xl font-bold mt-4">6. Data Retention</h2>
          <p>We retain data only as long as needed for the purposes stated or to meet legal/accounting requirements. Generic enquiry emails are typically retained for <span>12 months</span>. Booking records (for accounting / safety) may be stored up to 7 years per UK HMRC guidance. You may request deletion (see Your Rights) unless we must retain for legitimate reasons.</p>
          <h2 className="text-xl font-bold mt-4">7. Security</h2>
          <p>We apply reasonable technical and organisational measures (access controls, least-privilege, encrypted transport). No system is 100% secure; please contact us if you suspect misuse.</p>
          <h2 className="text-xl font-bold mt-4">8. Cookies & Similar Technologies</h2>
          <p>We use essential cookies for core site functionality and may use minimal analytics. Plausible analytics runs without tracking or storing personal data and does not use identifying cookies. If we introduce any optional marketing or performance cookies, a consent banner will list them before activation.</p>
          <h2 className="text-xl font-bold mt-4">9. Your Rights (UK GDPR)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access – request a copy of your personal data</li>
            <li>Rectification – correct inaccurate data</li>
            <li>Erasure – ask us to delete (where no overriding basis applies)</li>
            <li>Restriction – limit processing under certain conditions</li>
            <li>Objection – to processing based on legitimate interests / direct marketing</li>
            <li>Portability – receive data you provided in a machine-readable format (where applicable)</li>
            <li>Withdraw consent – for any consent-based processing at any time</li>
          </ul>
          <p>To exercise rights, email <span>privacy@oldcrowngirton.co.uk</span>. You also have the right to complain to the ICO (Information Commissioner’s Office) if you believe your rights are infringed.</p>
          <h2 className="text-xl font-bold mt-4">10. Children</h2>
          <p>We do not knowingly collect data from children under 13. If you believe a child has provided data, please contact us to remove it.</p>
          <h2 className="text-xl font-bold mt-4">11. International Transfers</h2>
          <p>Where providers process data outside the UK, we rely on adequacy decisions or approved safeguards (e.g. standard contractual clauses). Current third-party processors include: web hosting & infrastructure provider (managed server host in UK/EU), email service (transactional & inbound), Plausible (EU-based analytics). Any future additions will be updated here.</p>
          <h2 className="text-xl font-bold mt-4">12. Updates to this Policy</h2>
          <p>We may update this document. Material changes will be indicated by updating the “Effective Date”. Continued use of the site constitutes acceptance.</p>
          <h2 className="text-xl font-bold mt-4">13. Contact</h2>
          <p>Questions or requests: <span>privacy@oldcrowngirton.co.uk</span></p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
