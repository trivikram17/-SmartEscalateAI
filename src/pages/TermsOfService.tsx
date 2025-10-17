import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Shield } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using Smart Escalate AI's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
    },
    {
      icon: CheckCircle,
      title: "2. Use of Services",
      content: "You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates any applicable law or regulation, or in any manner that could damage, disable, or impair our services."
    },
    {
      icon: Shield,
      title: "3. User Accounts",
      content: "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account."
    },
    {
      icon: Scale,
      title: "4. Intellectual Property",
      content: "The services and their original content, features, and functionality are owned by Smart Escalate AI and are protected by international copyright, trademark, and other intellectual property laws."
    },
    {
      icon: XCircle,
      title: "5. Prohibited Activities",
      content: "You may not access or use the services for any purpose other than that for which we make them available. Prohibited activities include but are not limited to: attempting to gain unauthorized access, interfering with other users, or transmitting malicious code."
    },
    {
      icon: AlertTriangle,
      title: "6. Limitation of Liability",
      content: "In no event shall Smart Escalate AI be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the services."
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: October 17, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Smart Escalate AI. These Terms of Service ("Terms") govern your use of our website and services. By using our services, you agree to comply with and be bound by these Terms. Please review them carefully.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Sections */}
        <Card className="p-8 mt-8">
          <h2 className="text-xl font-bold mb-4">7. Service Modifications</h2>
          <p className="text-muted-foreground mb-6">
            We reserve the right to modify or discontinue, temporarily or permanently, the services (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the services.
          </p>

          <h2 className="text-xl font-bold mb-4">8. Termination</h2>
          <p className="text-muted-foreground mb-6">
            We may terminate or suspend your account and access to the services immediately, without prior notice or liability, for any reason, including if you breach these Terms.
          </p>

          <h2 className="text-xl font-bold mb-4">9. Governing Law</h2>
          <p className="text-muted-foreground mb-6">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-bold mb-4">10. Dispute Resolution</h2>
          <p className="text-muted-foreground mb-6">
            Any disputes arising out of or relating to these Terms or the services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2 className="text-xl font-bold mb-4">11. Changes to Terms</h2>
          <p className="text-muted-foreground mb-6">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@smartescalate.ai" className="text-primary hover:underline">
              legal@smartescalate.ai
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
