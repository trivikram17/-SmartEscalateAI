import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Information We Collect",
      content: "We collect information that you provide directly to us, including your name, email address, and any other information you choose to provide when using our services. We also automatically collect certain information about your device and how you interact with our platform."
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, to monitor and analyze trends and usage, and to personalize your experience with our AI-powered support system."
    },
    {
      icon: Lock,
      title: "3. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use encryption, secure servers, and regular security audits."
    },
    {
      icon: Eye,
      title: "4. Information Sharing",
      content: "We do not sell your personal information. We may share your information with service providers who help us operate our platform, with your consent, or when required by law. All third parties are bound by confidentiality agreements."
    },
    {
      icon: UserCheck,
      title: "5. Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You can also object to processing, request data portability, and withdraw consent at any time. Contact us to exercise these rights."
    },
    {
      icon: Shield,
      title: "6. Data Retention",
      content: "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. We will delete or anonymize your information when it is no longer needed."
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: October 17, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            At Smart Escalate AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered customer support platform. Please read this policy carefully to understand our practices regarding your personal data.
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

        {/* Additional Information */}
        <Card className="p-8 mt-8">
          <h2 className="text-xl font-bold mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-xl font-bold mb-4 mt-6">Children's Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
          
          <h2 className="text-xl font-bold mb-4 mt-6">Changes to This Policy</h2>
          <p className="text-muted-foreground mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-xl font-bold mb-4 mt-6">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@smartescalate.ai" className="text-primary hover:underline">
              privacy@smartescalate.ai
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
