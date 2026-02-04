import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ComplaintFormData } from '@/lib/types';

interface StepDescribeIssueProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const areas = [
  'Anna Nagar',
  'T. Nagar',
  'Mylapore',
  'Adyar',
  'Velachery',
  'Chromepet',
  'Tambaram',
  'Guindy',
  'Egmore',
  'Nungambakkam',
  'Kodambakkam',
  'Royapettah',
  'Triplicane',
  'Perambur',
  'Kolathur',
  'Other'
];

const StepDescribeIssue = ({ data, updateData }: StepDescribeIssueProps) => {
  const maxLength = 1000;
  const charCount = data.description.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Describe Your Issue
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your problem in any language (Tamil, English, or Tanglish)
        </p>
      </div>

      <div className="space-y-4">
        {/* Complaint Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            What is your complaint? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="உங்கள் பிரச்சனையை இங்கே விவரிக்கவும்... / Describe your problem here..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="min-h-[150px] text-base"
            maxLength={maxLength}
            aria-describedby="description-hint char-count"
            required
          />
          <div className="flex justify-between text-sm">
            <p id="description-hint" className="text-muted-foreground">
              Be as specific as possible about location and issue
            </p>
            <span 
              id="char-count"
              className={charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        </div>

        {/* Area/Location */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-base font-medium">
            Area / Location <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.area}
            onValueChange={(value) => updateData({ area: value })}
          >
            <SelectTrigger id="area" className="w-full">
              <SelectValue placeholder="Select your area" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the area where the issue is located
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepDescribeIssue;
