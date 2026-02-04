import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Brain, 
  Users, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  ArrowRight,
  Smartphone,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  const citizenSteps = [
    {
      icon: FileText,
      title: 'Submit Your Complaint',
      description: 'Describe your issue in any language - Tamil, English, or Tanglish. Our system understands all.'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI categorizes your complaint, assigns priority, and identifies relevant welfare schemes.'
    },
    {
      icon: Users,
      title: 'Officer Review',
      description: 'Government officers verify and process your complaint through our streamlined dashboard.'
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Receive SMS and email updates as your complaint moves through the resolution process.'
    },
    {
      icon: CheckCircle,
      title: 'Resolution',
      description: 'Your issue gets resolved and linked to appropriate welfare schemes if eligible.'
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Access the platform easily from any device, anywhere in Tamil Nadu.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected following government data security guidelines.'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'AI-powered categorization means faster routing to the right department.'
    }
  ];

  const faqs = [
    {
      question: 'What languages can I use to file a complaint?',
      answer: 'You can write your complaint in Tamil, English, or Tanglish (a mix of both). Our AI system is trained to understand all three and will process your complaint accordingly.'
    },
    {
      question: 'How long does it take to process a complaint?',
      answer: 'Most complaints are reviewed within 24 hours. Resolution time depends on the nature of the issue - typically 3-7 working days for standard complaints, with high-priority issues handled faster.'
    },
    {
      question: 'How do I track my complaint status?',
      answer: 'You will receive an SMS with your reference number upon submission. Use this number to inquire about status via SMS or by contacting the helpline. We also send automatic updates as your complaint progresses.'
    },
    {
      question: 'What welfare schemes can I be connected to?',
      answer: 'Based on your complaint and eligibility, you may be linked to schemes like Jal Jeevan Mission (water), PMAY (housing), Ayushman Bharat (healthcare), Swachh Bharat (sanitation), and many state-specific welfare programs.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, all personal data is encrypted and stored securely following Government of India data protection guidelines. Your information is only shared with relevant government departments for complaint resolution.'
    },
    {
      question: 'What if I don\'t have internet access?',
      answer: 'You can file complaints through our toll-free helpline or visit your local e-Seva center where staff can assist you in filing your complaint through the portal.'
    }
  ];

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Civisense Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A modern, AI-powered platform connecting citizens with government services 
            for faster grievance resolution and welfare scheme access.
          </p>
        </section>

        {/* For Citizens - Step by Step */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            For Citizens
          </h2>
          <div className="space-y-4">
            {citizenSteps.map((step, index) => (
              <Card key={step.title}>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                File a Complaint Now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        {/* About the AI System */}
        <section className="bg-muted/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            About Our AI System
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                  Smart Categorization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Our AI reads your complaint in any language and automatically identifies 
                whether it's about water, roads, healthcare, or other services with 
                90%+ accuracy.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                  Priority Scoring
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Complaints are scored based on urgency, vulnerability factors 
                (senior citizens, low-income, disabilities), and service criticality 
                to ensure the most urgent cases get attention first.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                  Scheme Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Based on your complaint and profile, our system suggests relevant 
                government welfare schemes you may be eligible for, helping you 
                access more benefits.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section className="text-center bg-primary/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Need More Help?</h2>
          <p className="text-muted-foreground mb-4">
            Contact our helpline for assistance with filing complaints or tracking status.
          </p>
          <div className="space-y-2">
            <p className="font-semibold">Toll-Free: 1800-XXX-XXXX</p>
            <p className="text-sm text-muted-foreground">Available Monday to Saturday, 9 AM to 6 PM</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HowItWorks;
