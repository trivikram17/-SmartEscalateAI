import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign, Users, Rocket, Heart, TrendingUp } from "lucide-react";

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Continuous learning opportunities and career development"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented people in a collaborative environment"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Work on cutting-edge AI technology and solutions"
    }
  ];

  const openings = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $180k"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100k - $140k"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80k - $110k"
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$110k - $150k"
    },
    {
      title: "Content Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      salary: "$60k - $80k"
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">We're Hiring!</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us revolutionize customer support with AI. We're looking for talented individuals who are passionate about technology and innovation.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
          <h3 className="text-2xl font-bold mb-3">Don't see a perfect fit?</h3>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
            Send Resume
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Careers;
