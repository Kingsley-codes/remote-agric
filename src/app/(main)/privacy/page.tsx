import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return <LegalPage eyebrow="Legal" title="Privacy Policy" intro="How Remote Agric handles the personal information needed to operate accounts, farm ownership, payments, and support." sections={[
    { title: "Information we collect", content: <p>We collect information you provide when creating or managing an account, including your name, email address, phone number, address, profile details, support messages, and bank-account details where you choose to add them. We also collect transaction, farm ownership, device, and service-usage information needed to run the platform.</p> },
    { title: "How we use information", content: <p>We use information to create and secure accounts, process payments and withdrawals, administer farm ownership records, provide updates and support, prevent fraud and abuse, improve our services, and meet legal or operational obligations.</p> },
    { title: "When we share information", content: <p>We may share the minimum necessary information with payment processors, banks, hosting and communications providers, professional advisers, and authorities where required by law. We do not sell your personal information.</p> },
    { title: "Security and retention", content: <p>We use reasonable administrative and technical safeguards, including authenticated sessions, to protect information. No online system is completely secure. We retain information for as long as needed for the purposes above, including record-keeping, dispute resolution, security, and legal obligations.</p> },
    { title: "Your choices", content: <p>You can ask to access, correct, or update your account information through your profile or by contacting us. Some information must be retained where required to process transactions, protect the service, or comply with law.</p> },
    { title: "Cookies and updates", content: <p>We use essential cookies and similar technologies to keep you signed in and protect sessions. See our <a className="font-medium text-primary underline underline-offset-2" href="/cookie-policy">Cookie Policy</a>. We may update this policy by publishing a new version on this page.</p> },
  ]} />;
}
