import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { userApi } from '@/services/api';
import { User } from '@/contexts/AuthContext';
import { Loader2, Save, X } from 'lucide-react';
import PracticeAreaSelect from '@/components/PracticeAreaSelect';

// Form validation schema
const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  practice_area: z.string().min(2, 'Practice area is required'),
  location: z.string().optional(),
  years_of_experience: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  law_specialization: z.string().optional(),
  education: z.string().optional(),
  bar_exam_status: z.enum(['Passed', 'Pending', 'Not Applicable']).optional(),
  license_number: z.string().optional(),
  linkedin_profile: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  alumni_of: z.string().optional(),
  professional_organizations: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onCancel, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      practice_area: user.practiceArea || '',
      location: user.location || '',
      years_of_experience: user.yearsOfExperience?.toString() || '',
      law_specialization: user.lawSpecialization || '',
      education: user.education || '',
      bar_exam_status: user.barExamStatus as 'Passed' | 'Pending' | 'Not Applicable' || 'Not Applicable',
      license_number: user.licenseNumber || '',
      linkedin_profile: user.linkedinProfile || '',
      alumni_of: user.alumniOf || '',
      professional_organizations: user.professionalOrganizations || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await userApi.updateProfile(data);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'default',
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-gray-100 shadow-xl bg-white">
      <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-black modern-heading">Edit Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Update your personal and professional information
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="practice_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Area *</FormLabel>
                      <FormControl>
                        <PracticeAreaSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select your practice area"
                          showContentStats={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Enter years of experience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="law_specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law Specialization</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your specialization" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bar_exam_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bar Exam Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Passed">Passed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your license number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your education background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="alumni_of"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alumni Of</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your alma mater" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="linkedin_profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="professional_organizations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Organizations</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="List your professional organizations and memberships..."
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-lawvriksh-navy hover:bg-lawvriksh-navy/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
