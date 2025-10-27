import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileCheck, Globe, Award, CheckCircle } from "lucide-react";

const Compliance = () => {
  const standards = [
    {
      icon: Shield,
      title: "GDPR Compliance",
      description: "We are fully compliant with the General Data Protection Regulation (GDPR) and respect the privacy rights of EU citizens.",
      badge: "EU Regulation"
    },
    {
      icon: Lock,
      title: "SOC 2 Type II",
      description: "Our security controls and procedures meet the rigorous requirements of SOC 2 Type II certification.",
      badge: "Security"
    },
    {
      icon: FileCheck,
      title: "ISO 27001",
      description: "We maintain an Information Security Management System (ISMS) certified to ISO 27001 standards.",
      badge: "International"
    },
    {
      icon: Globe,
      title: "CCPA Compliance",
      description: "We comply with the California Consumer Privacy Act and protect the rights of California residents.",
      badge: "US Regulation"
    },
    {
      icon: Award,
      title: "HIPAA Ready",
      description: "Our platform can be configured to meet HIPAA requirements for handling protected health information.",
      badge: "Healthcare"
    },
    {
      icon: CheckCircle,
      title: "PCI DSS",
      description: "Payment Card Industry Data Security Standard compliance for secure payment processing.",
      badge: "Payment Security"
    }
  ];

  const commitments = [
    {
      title: "Data Protection",
      items: [
        "End-to-end encryption for all data in transit and at rest",
        "Regular security audits and penetration testing",
        "Strict access controls and authentication protocols",
        "Automatic data backup and disaster recovery procedures"
      ]
    },
    {
      title: "Transparency",
      items: [
        "Clear and accessible privacy policies",
        "Regular compliance reports and updates",
        "Open communication about data handling practices",
        "User-friendly data access and deletion requests"
      ]
    },
    {
      title: "Continuous Improvement",
      items: [
        "Regular training for all team members",
        "Monitoring of regulatory changes and updates",
        "Investment in security infrastructure",
        "Third-party compliance assessments"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Compliance & Security</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We take security and compliance seriously. Our platform meets the highest industry standards to protect your data and ensure regulatory compliance.
          </p>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Certifications & Standards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards.map((standard, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <standard.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{standard.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {standard.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Statement */}
        <Card className="p-8 mb-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Security Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Smart Escalate AI, security is not just a feature—it's the foundation of everything we build. We employ industry-leading practices to ensure your data is protected at all times. Our security team continuously monitors for threats and updates our systems to defend against emerging vulnerabilities. We undergo regular third-party audits and maintain compliance with international standards to give you peace of mind.
              </p>
            </div>
          </div>
        </Card>

        {/* Commitments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Commitments to You</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {commitments.map((commitment, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-bold mb-4">{commitment.title}</h3>
                <ul className="space-y-3">
                  {commitment.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Questions About Compliance?</h2>
          <p className="text-muted-foreground mb-6">
            We're here to help answer any questions you have about our compliance posture, security practices, or certifications. Our team can provide additional documentation, audit reports, and compliance information as needed.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:compliance@smartescalate.ai" className="text-primary hover:underline">
              compliance@smartescalate.ai
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="mailto:security@smartescalate.ai" className="text-primary hover:underline">
              security@smartescalate.ai
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Compliance;
