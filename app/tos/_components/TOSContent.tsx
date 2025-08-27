/* eslint-disable react/no-unescaped-entities */
import { CANCELLATION_POLICY, DEPOSIT_POLICY } from "@/lib/policies";

export default function TOSContent() {
  return (
    <div className="leading-relaxed space-y-6 text-sm px-5">
      <p><strong>Effective Date:</strong> <span>10 August 2025</span></p>
      <p>These Terms govern your use of this website (the "Site") operated for <strong>The Old Crown Girton</strong> ("we", "us"). By accessing or using the Site you agree to these Terms. If you do not agree, discontinue use.</p>
      
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
      <p>The Site is provided "as is." To the extent permitted by law we exclude implied warranties and are not liable for indirect, incidental, or consequential loss from Site use. Nothing limits liability for fraud or personal injury caused by negligence.</p>
      
      <h2 className="text-xl font-bold mt-4">11. Changes</h2>
      <p>We may modify these Terms; updates will show a new Effective Date. Continued use = acceptance.</p>
      
      <h2 className="text-xl font-bold mt-4">12. Severability</h2>
      <p>If any provision is unenforceable the remainder remains effective.</p>
      
      <h2 className="text-xl font-bold mt-4">13. Governing Law</h2>
      <p>England & Wales law; courts of England & Wales have exclusive jurisdiction.</p>
      
      <h2 className="text-xl font-bold mt-4">14. Contact</h2>
      <p>Questions: <span>legal@oldcrowngirton.co.uk</span></p>
    </div>
  );
}