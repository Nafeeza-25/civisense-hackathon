import { CheckCircle, FileText, Gauge, Lightbulb, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ComplaintSubmissionResult } from '@/lib/types';

interface SubmissionResultProps {
  result: ComplaintSubmissionResult;
  onNewComplaint: () => void;
}

const SubmissionResult = ({ result, onNewComplaint }: SubmissionResultProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyReferenceId = async () => {
    await navigator.clipboard.writeText(result.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityColor = 
    result.priorityScore >= 70 ? 'text-red-600 bg-red-100' :
    result.priorityScore >= 50 ? 'text-yellow-600 bg-yellow-100' :
    'text-green-600 bg-green-100';

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Complaint Submitted Successfully!
        </h2>
        <p className="text-muted-foreground">
          Your complaint has been registered and analyzed by our AI system
        </p>
      </div>

      {/* Reference Number */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="text-2xl font-bold text-primary">{result.referenceId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferenceId}
              className="gap-2"
              aria-label={copied ? "Copied" : "Copy reference number"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              Detected Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{result.category}</p>
            <Badge variant="secondary" className="mt-2">
              {result.confidence}% confidence
            </Badge>
          </CardContent>
        </Card>

        {/* Priority Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4" aria-hidden="true" />
              Priority Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold px-3 py-1 rounded-lg ${priorityColor}`}>
                {result.priorityScore}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {result.urgencyExplanation}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Scheme */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
            Suggested Welfare Scheme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-blue-900">{result.suggestedScheme}</p>
          <p className="text-sm text-blue-800/80 mt-2">
            {result.schemeExplanation}
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onNewComplaint} variant="outline" className="flex-1">
          File Another Complaint
        </Button>
        <Button onClick={() => navigate('/how-it-works')} className="flex-1 gap-2">
          Learn More About the Process
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default SubmissionResult;
