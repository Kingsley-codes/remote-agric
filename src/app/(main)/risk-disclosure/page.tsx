import LegalPage from "@/components/legal/LegalPage";

export default function RiskDisclosurePage() {
  return <LegalPage eyebrow="Important information" title="Risk Disclosure" intro="Farm ownership can involve loss, delay, and operational uncertainty. Review these risks before you pay for an opportunity." sections={[
    { title: "No guaranteed return", content: <p>Any projected ROI, yield, price, timeline, or other figure shown on Remote Agric is an estimate, not a guarantee. You may receive less than expected, receive nothing, or experience a delay.</p> },
    { title: "Agricultural and market risk", content: <p>Weather, pests, disease, crop failure, input costs, logistics, theft, market prices, and other factors can affect a farm cycle and its outcome. Insurance or other mitigation, if available for a specific project, may have limits and exclusions.</p> },
    { title: "Liquidity and timing risk", content: <p>Farm ownership units may not be transferable or redeemable before the cycle ends. Payment confirmation, harvest processing, wallet credits, and withdrawals can take time and may depend on operational, verification, and third-party processes.</p> },
    { title: "Platform and third-party risk", content: <p>The platform relies on internet connectivity, payment providers, banks, and other service providers. Interruptions, errors, account-security incidents, and provider delays can affect access or transaction timing.</p> },
    { title: "Your decision", content: <p>Consider your financial circumstances and only participate with funds you can afford to put at risk. Review the specific opportunity and these terms carefully; seek independent financial, legal, or tax advice if you need it. Remote Agric does not provide personalised investment advice.</p> },
  ]} />;
}
