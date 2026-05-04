import type { Metadata } from "next";
import { canonical, alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Panamares privacy policy. Information about the processing of personal data collected through panamares.com.",
  alternates: {
    canonical: canonical("/en/privacy"),
    languages: alternates("/privacidad", "/en/privacy"),
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPageEn() {
  return (
    <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[100px]">
      <div className="max-w-[800px] mx-auto flex flex-col gap-[40px]">

        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[#5a6478] text-[12px] uppercase tracking-[5px]">Legal</p>
          <h1 className="font-heading font-normal text-[#0c1834] text-[clamp(36px,4vw,52px)] tracking-[-0.03em] leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="font-body text-[#5a6478] text-[14px]">Last updated: April 2025</p>
        </div>

        <div className="flex flex-col gap-[32px] font-body text-[#0c1834] text-[16px] leading-[1.7]">

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">1. Data controller</h2>
            <p>Panamares Realty S.A. (&ldquo;Panamares&rdquo;, &ldquo;we&rdquo;) is responsible for the processing of personal data collected through the website <strong>panamares.com</strong>. For any inquiry you can contact us at <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">2. Data we collect</h2>
            <p>We only collect the data you voluntarily provide through our contact forms:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Message or inquiry</li>
              <li>Reference to the property of interest</li>
            </ul>
            <p>Additionally, our site may automatically collect navigation data (IP address, browser type, pages visited) for statistical purposes through analytics tools.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">3. Purpose of processing</h2>
            <p>Your personal data is used exclusively to:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Respond to your inquiries about properties</li>
              <li>Contact you regarding properties of your interest</li>
              <li>Send commercial information related to our real estate services (only with your express consent)</li>
              <li>Improve our services and user experience</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">4. Legal basis</h2>
            <p>The processing of your data is based on the consent you grant when submitting our forms, and on the legitimate interest of Panamares to handle requests for real estate information.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">5. Data retention</h2>
            <p>Your data will be retained for as long as necessary to manage your inquiry and, in the case of a commercial relationship, for the period established by the applicable legislation of the Republic of Panama.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">6. Sharing data with third parties</h2>
            <p>We do not sell or transfer your personal data to third parties. We only share it with technical service providers strictly necessary for the operation of the site (such as email delivery services), who are contractually obligated to maintain confidentiality.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">7. Your rights</h2>
            <p>In accordance with Law 81 of 2019 on Personal Data Protection of Panama, you have the right to:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request the deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">8. Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss or improper disclosure.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">9. Changes to this policy</h2>
            <p>We reserve the right to update this Privacy Policy. Any change will be published on this page with the corresponding update date.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
