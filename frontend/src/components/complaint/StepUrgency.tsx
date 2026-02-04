import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplaintFormData, UrgencyLevel } from '@/lib/types';

interface StepUrgencyProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const urgencyLevels: { value: UrgencyLevel; label: string; icon: React.ElementType; description: string; colorClass: string }[] = [
  { 
    value: 'low', 
    label: 'Low', 
    icon: CheckCircle, 
    description: 'Issue can wait. No immediate impact on daily life.',
    colorClass: 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: Clock, 
    description: 'Issue needs attention soon but not immediately critical.',
    colorClass: 'border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
  },
  { 
    value: 'high', 
    label: 'High', 
    icon: AlertTriangle, 
    description: 'Urgent! Issue is affecting health, safety, or essential services.',
    colorClass: 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100'
  },
];

const StepUrgency = ({ data, updateData }: StepUrgencyProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          How Urgent Is This Issue?
        </h2>
        <p className="text-muted-foreground text-sm">
          Help us prioritize by indicating the urgency level
        </p>
      </div>

      <div 
        className="space-y-4"
        role="radiogroup"
        aria-label="Urgency level selection"
      >
        {urgencyLevels.map(({ value, label, icon: Icon, description, colorClass }) => {
          const isSelected = data.urgency === value;
          
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateData({ urgency: value })}
              className={cn(
                "w-full flex items-start gap-4 p-4 md:p-5 rounded-lg border-2 transition-all text-left",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected ? colorClass : "border-border bg-background hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                value === 'low' && "bg-green-100",
                value === 'medium' && "bg-yellow-100",
                value === 'high' && "bg-red-100"
              )}>
                <Icon 
                  className={cn(
                    "w-6 h-6",
                    value === 'low' && "text-green-600",
                    value === 'medium' && "text-yellow-600",
                    value === 'high' && "text-red-600"
                  )} 
                  aria-hidden="true" 
                />
              </div>
              <div className="flex-1">
                <span className={cn(
                  "font-semibold text-lg block",
                  isSelected 
                    ? value === 'low' ? "text-green-700" : value === 'medium' ? "text-yellow-700" : "text-red-700"
                    : "text-foreground"
                )}>
                  {label} Priority
                </span>
                <span className={cn(
                  "text-sm mt-1 block",
                  isSelected ? "opacity-90" : "text-muted-foreground"
                )}>
                  {description}
                </span>
              </div>
              {isSelected && (
                <CheckCircle className="w-6 h-6 flex-shrink-0 text-current" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepUrgency;
