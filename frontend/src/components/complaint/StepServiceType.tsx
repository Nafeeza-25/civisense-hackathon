import { Droplets, Construction, Heart, Home, Users, Zap, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplaintFormData, ServiceType } from '@/lib/types';

interface StepServiceTypeProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const serviceTypes: { value: ServiceType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'water', label: 'Water', icon: Droplets, description: 'Water supply issues' },
  { value: 'road', label: 'Road', icon: Construction, description: 'Road & infrastructure' },
  { value: 'health', label: 'Health', icon: Heart, description: 'Healthcare services' },
  { value: 'housing', label: 'Housing', icon: Home, description: 'Housing assistance' },
  { value: 'welfare', label: 'Welfare', icon: Users, description: 'Social welfare' },
  { value: 'electricity', label: 'Electricity', icon: Zap, description: 'Power supply issues' },
  { value: 'sanitation', label: 'Sanitation', icon: Trash2, description: 'Cleanliness & waste' },
  { value: 'other', label: 'Other', icon: HelpCircle, description: 'Other services' },
];

const StepServiceType = ({ data, updateData }: StepServiceTypeProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Select Service Type
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the category that best describes your issue
        </p>
      </div>

      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        role="radiogroup"
        aria-label="Service type selection"
      >
        {serviceTypes.map(({ value, label, icon: Icon, description }) => {
          const isSelected = data.serviceType === value;
          
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateData({ serviceType: value })}
              className={cn(
                "flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border-2 transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 mb-2",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} 
                aria-hidden="true" 
              />
              <span className={cn(
                "font-medium text-sm md:text-base",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {label}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center hidden md:block">
                {description}
              </span>
            </button>
          );
        })}
      </div>

      {data.serviceType && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Selected: <span className="font-medium text-foreground">{serviceTypes.find(s => s.value === data.serviceType)?.label}</span>
        </p>
      )}
    </div>
  );
};

export default StepServiceType;
