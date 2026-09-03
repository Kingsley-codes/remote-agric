import LegalPage from "@/components/legal/LegalPage";

export default function CookiePolicyPage() {
  return <LegalPage eyebrow="Legal" title="Cookie Policy" intro="How cookies help Remote Agric remember your session and operate securely." sections={[
    { title: "What cookies are", content: <p>Cookies are small files placed on your browser or device. Similar technologies may store or read limited information to support a website or app.</p> },
    { title: "How we use them", content: <p>Remote Agric uses essential cookies to maintain authenticated sessions, help protect accounts, and remember necessary service preferences. These are required for core features such as account access and secure requests.</p> },
    { title: "Managing cookies", content: <p>You can control or remove cookies through your browser settings. Blocking essential cookies may prevent you from signing in or using parts of the service correctly.</p> },
    { title: "Questions", content: <p>For more information about personal-data handling, read the <a className="font-medium text-primary underline underline-offset-2" href="/privacy">Privacy Policy</a> or contact us.</p> },
  ]} />;
}
