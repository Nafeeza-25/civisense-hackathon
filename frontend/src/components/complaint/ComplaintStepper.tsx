import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplaintStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const ComplaintStepper = ({ currentStep, totalSteps, stepLabels }: ComplaintStepperProps) => {
  return (
    <div className="w-full mb-8">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {stepLabels[currentStep - 1]}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStep} of ${totalSteps}: ${stepLabels[currentStep - 1]}`}
          />
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden md:block">
        <ol className="flex items-center w-full" role="list">
          {stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isLast = stepNum === totalSteps;

            return (
              <li 
                key={label}
                className={cn(
                  "flex items-center",
                  !isLast && "flex-1"
                )}
              >
                <div className="flex flex-col items-center">
                  {/* Step circle */}
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-colors",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isCurrent && "border-primary text-primary bg-background",
                      !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground bg-background"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {/* Step label */}
                  <span 
                    className={cn(
                      "mt-2 text-xs text-center max-w-[80px]",
                      isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div 
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default ComplaintStepper;
