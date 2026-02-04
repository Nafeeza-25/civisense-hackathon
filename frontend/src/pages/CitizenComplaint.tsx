import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ComplaintStepper from '@/components/complaint/ComplaintStepper';
import StepDescribeIssue from '@/components/complaint/StepDescribeIssue';
import StepServiceType from '@/components/complaint/StepServiceType';
import StepUrgency from '@/components/complaint/StepUrgency';
import StepVulnerability from '@/components/complaint/StepVulnerability';
import StepContact from '@/components/complaint/StepContact';
import SubmissionResult from '@/components/complaint/SubmissionResult';
import { api } from '@/services/api';
import type { ComplaintFormData, ComplaintSubmissionResult } from '@/lib/types';

const initialFormData: ComplaintFormData = {
  description: '',
  area: '',
  serviceType: 'other',
  urgency: 'medium',
  vulnerability: {
    seniorCitizen: false,
    lowIncome: false,
    disability: false
  },
  name: '',
  phone: '',
  email: '',
  consent: false
};

const stepLabels = ['Describe', 'Category', 'Urgency', 'Vulnerability', 'Contact'];

const CitizenComplaint = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ComplaintFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ComplaintSubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<ComplaintFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.description.trim().length > 10 && formData.area !== '';
      case 2:
        return formData.serviceType !== undefined;
      case 3:
        return formData.urgency !== undefined;
      case 4:
        return true; // Vulnerability is optional
      case 5:
        return (
          formData.name.trim().length > 0 &&
          formData.phone.length === 10 &&
          formData.consent
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError('Please fill in all required fields and accept the consent checkbox.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await api.submitComplaint(formData);
      setSubmissionResult(result);
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmissionResult(null);
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepDescribeIssue data={formData} updateData={updateFormData} />;
      case 2:
        return <StepServiceType data={formData} updateData={updateFormData} />;
      case 3:
        return <StepUrgency data={formData} updateData={updateFormData} />;
      case 4:
        return <StepVulnerability data={formData} updateData={updateFormData} />;
      case 5:
        return <StepContact data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  // Show submission result
  if (submissionResult) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <SubmissionResult result={submissionResult} onNewComplaint={handleNewComplaint} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            File a Complaint
          </h1>
          <p className="text-muted-foreground">
            Submit your civic grievance and we'll help connect you with the right services
          </p>
        </div>

        {/* Stepper */}
        <ComplaintStepper
          currentStep={currentStep}
          totalSteps={5}
          stepLabels={stepLabels}
        />

        {/* Form Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Step Content */}
            {renderStep()}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm" role="alert">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(5) || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip vulnerability step hint */}
        {currentStep === 4 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            This step is optional. Click Next to skip if not applicable.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default CitizenComplaint;
