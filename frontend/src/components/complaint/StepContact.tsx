import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail } from 'lucide-react';
import type { ComplaintFormData } from '@/lib/types';

interface StepContactProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const StepContact = ({ data, updateData }: StepContactProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Contact Information
        </h2>
        <p className="text-muted-foreground text-sm">
          We'll use this to send you updates about your complaint
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            required
            aria-required="true"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            pattern="[0-9]{10}"
            maxLength={10}
            required
            aria-required="true"
            aria-describedby="phone-hint"
          />
          <p id="phone-hint" className="text-sm text-muted-foreground">
            We'll send SMS updates to this number
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            Email Address <span className="text-muted-foreground text-sm">(Optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            aria-describedby="email-hint"
          />
          <p id="email-hint" className="text-sm text-muted-foreground">
            Optional. For receiving detailed updates via email.
          </p>
        </div>

        {/* Consent */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={data.consent}
              onCheckedChange={(checked) => updateData({ consent: checked as boolean })}
              className="mt-1"
              aria-required="true"
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I consent to the collection and processing of my personal data for the purpose 
              of addressing my complaint. I understand that my information will be handled 
              in accordance with the Government Data Protection Guidelines.
              <span className="text-destructive"> *</span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepContact;
