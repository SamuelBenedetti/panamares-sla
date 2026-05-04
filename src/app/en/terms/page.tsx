import type { Metadata } from "next";
import { canonical, alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms and conditions for using the Panamares website. Service terms for real estate brokerage in Panama City.",
  alternates: {
    canonical: canonical("/en/terms"),
    languages: alternates("/terminos", "/en/terms"),
  },
  robots: { index: true, follow: true },
};

export default function TermsPageEn() {
  return (
    <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[100px]">
      <div className="max-w-[800px] mx-auto flex flex-col gap-[40px]">

        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[#5a6478] text-[12px] uppercase tracking-[5px]">Legal</p>
          <h1 className="font-heading font-normal text-[#0c1834] text-[clamp(36px,4vw,52px)] tracking-[-0.03em] leading-[1.1]">
            Terms and Conditions
          </h1>
          <p className="font-body text-[#5a6478] text-[14px]">Last updated: April 2025</p>
        </div>

        <div className="flex flex-col gap-[32px] font-body text-[#0c1834] text-[16px] leading-[1.7]">

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">1. Acceptance of terms</h2>
            <p>By accessing and using the website <strong>panamares.com</strong>, you agree to be bound by these Terms and Conditions. If you do not agree with any of the terms set out here, please do not use this site.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">2. About Panamares</h2>
            <p>Panamares Realty S.A. is a real estate company operating in the Republic of Panama, dedicated to brokerage in the sale and rental of real estate. We act as intermediaries and do not own the properties listed on this site unless expressly stated otherwise.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">3. Use of the site</h2>
            <p>This website is for personal, non-commercial use. You agree to:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Not reproduce, distribute or commercially exploit any content without written authorization</li>
              <li>Not use automated tools (bots, scrapers) to extract information from the site</li>
              <li>Not submit false information through our forms</li>
              <li>Not attempt to access restricted parts of the system</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">4. Property information</h2>
            <p>Information on prices, availability and property characteristics is published for informational purposes and may be subject to change without notice. Panamares does not guarantee the accuracy, completeness or currency of the information published. Prices shown are indicative and may not include taxes, notary fees or other applicable charges.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">5. Brokerage services</h2>
            <p>Panamares acts as an intermediary between buyers/tenants and sellers/landlords. Any resulting agreement, contract or transaction is exclusively between the parties involved. Panamares is not responsible for the non-compliance of any party in a real estate transaction.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">6. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Panamares shall not be liable for:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Direct or indirect damages arising from the use of this site</li>
              <li>Inaccuracies in property information</li>
              <li>Interruptions in site availability</li>
              <li>Investment decisions made based on the information published</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">7. Intellectual property</h2>
            <p>All content on this site — including text, images, logos and design — is the property of Panamares Realty S.A. or their respective owners, and is protected by the intellectual property laws of the Republic of Panama. Total or partial reproduction without prior authorization is prohibited.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">8. Third-party links</h2>
            <p>This site may contain links to third-party websites. Panamares is not responsible for the content, privacy policies or practices of such sites.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">9. Applicable law and jurisdiction</h2>
            <p>These Terms and Conditions are governed by the laws of the Republic of Panama. Any dispute arising from the use of this site shall be submitted to the jurisdiction of the competent courts of Panama City.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">10. Modifications</h2>
            <p>Panamares reserves the right to modify these Terms and Conditions at any time. Modifications will take effect upon publication on this site. Continued use of the site after such modifications implies acceptance of the new terms.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">11. Contact</h2>
            <p>For any inquiry about these Terms and Conditions, you can contact us at <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
