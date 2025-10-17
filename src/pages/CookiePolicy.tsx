import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, CheckCircle, XCircle, Info } from "lucide-react";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: CheckCircle,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.",
      required: true
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      required: false
    },
    {
      icon: Info,
      title: "Analytics Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
      required: false
    },
    {
      icon: Cookie,
      title: "Marketing Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other sites.",
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last updated: October 17, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies to improve your experience on our platform, analyze how our services are used, and deliver personalized content and advertisements.
          </p>
        </Card>

        {/* Cookie Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map((type, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{type.title}</h3>
                      {type.required ? (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          Always Active
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Managing Cookies */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Browser Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Most browsers allow you to refuse cookies through their settings. Visit your browser's help section for more information.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Third-Party Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  You can opt out of third-party cookies through industry opt-out programs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Cookie Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Use our cookie preference center to customize which cookies you want to allow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
              <Settings className="w-4 h-4 mr-2" />
              Manage Preferences
            </Button>
            <Button variant="outline">
              <XCircle className="w-4 h-4 mr-2" />
              Reject Optional
            </Button>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and improve our services.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We may update this Cookie Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about our use of cookies, please contact us at{" "}
            <a href="mailto:privacy@smartescalate.ai" className="text-primary hover:underline">
              privacy@smartescalate.ai
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;
