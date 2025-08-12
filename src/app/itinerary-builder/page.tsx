'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateItinerary } from '@/ai/flows/generate-itinerary';
import { improveItinerary } from '@/ai/flows/improve-itinerary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Sparkles, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const itinerarySchema = z.object({
  destination: z.string().min(2, 'Destination is required.'),
  dates: z.string().min(5, 'Please provide travel dates.'),
  interests: z.string().min(3, 'Tell us your interests.'),
  budget: z.enum(['low', 'medium', 'high']),
});

type ItineraryFormValues = z.infer<typeof itinerarySchema>;

export default function ItineraryBuilderPage() {
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      destination: '',
      dates: '',
      interests: '',
      budget: 'medium',
    },
  });

  const handleGenerateItinerary = async (values: ItineraryFormValues) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateItinerary(values);
      setItinerary(result.itinerary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Itinerary',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImproveItinerary = async () => {
    if (!itinerary || !feedback) return;
    setIsImproving(true);
    try {
      const result = await improveItinerary({
        existingItinerary: itinerary,
        userFeedback: feedback,
      });
      setItinerary(result.improvedItinerary);
      setFeedback('');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Improving Itinerary',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            Create Your Perfect Trip
          </CardTitle>
          <CardDescription>
            Fill in your preferences and let our AI craft a personalized itinerary for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateItinerary)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dates</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10/15/2024 - 10/22/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., history, food, adventure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Itinerary
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:sticky top-6">
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle>Your AI-Generated Itinerary</CardTitle>
            <CardDescription>
              Here is your personalized travel plan. You can refine it with feedback below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 font-semibold">Crafting your adventure...</p>
              </div>
            )}
            {!isLoading && !itinerary && (
              <div className="flex flex-col items-center justify-center h-80 text-center text-muted-foreground p-4">
                 <Sparkles className="h-12 w-12 text-primary/50" />
                <p className="mt-4 font-semibold">Your itinerary will appear here.</p>
                <p className="text-sm">Fill out the form to get started!</p>
              </div>
            )}
            {itinerary && (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap bg-secondary p-4 rounded-md font-body">
                {itinerary}
              </div>
            )}
          </CardContent>
          {itinerary && (
            <CardFooter className="flex flex-col items-stretch gap-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback" className="flex items-center gap-2 font-semibold">
                        <Lightbulb className="text-primary"/>
                        Refine Your Itinerary
                    </Label>
                    <Textarea 
                        id="feedback"
                        placeholder="e.g., 'More outdoor activities please', 'Can we add some museums?', 'I prefer Italian food.'"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <Button onClick={handleImproveItinerary} disabled={isImproving || !feedback}>
                    {isImproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Improve Itinerary
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
