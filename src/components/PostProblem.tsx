
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Camera, MapPin, Plus } from "lucide-react";
import { useProblems } from "@/hooks/useProblems";
import { useToast } from "@/hooks/use-toast";

interface PostProblemProps {
  onBack: () => void;
}

const PostProblem = ({ onBack }: PostProblemProps) => {
  const { createProblem } = useProblems();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    location: '',
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');

  const suggestedTags = [
    'Infrastructure', 'Safety', 'Environment', 'Education', 
    'Health', 'Community', 'Traffic', 'Waste', 'Digital', 'Youth'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createProblem(problemData);
      
      if (error) {
        toast({
          title: 'Error creating mission',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Mission Created!',
          description: 'Your problem has been submitted for review.',
        });
        onBack();
      }
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (!problemData.tags.includes(tag)) {
      setProblemData({
        ...problemData,
        tags: [...problemData.tags, tag]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProblemData({
      ...problemData,
      tags: problemData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addCustomTag = () => {
    if (newTag.trim() && !problemData.tags.includes(newTag)) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mr-3"
            disabled={loading}
          >
            <ArrowDown className="w-4 h-4 rotate-90" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-ncc-navy">Report a Problem</h1>
            <p className="text-gray-600 text-sm">Help your community by identifying issues</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-ncc-navy">Problem Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Placeholder */}
              <div>
                <Label>Add Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Photo upload coming soon</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Problem Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Broken street lights on MG Road"
                  value={problemData.title}
                  onChange={(e) => setProblemData({...problemData, title: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem in detail. Include impact on community, urgency, and any relevant context..."
                  value={problemData.description}
                  onChange={(e) => setProblemData({...problemData, description: e.target.value})}
                  rows={4}
                  required
                  disabled={loading}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Enter specific location"
                    value={problemData.location}
                    onChange={(e) => setProblemData({...problemData, location: e.target.value})}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="mt-2 space-y-3">
                  {/* Selected Tags */}
                  {problemData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {problemData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="default"
                          className="bg-ncc-navy cursor-pointer"
                          onClick={() => !loading && removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => !loading && addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                      disabled={loading}
                    />
                    <Button 
                      type="button" 
                      onClick={addCustomTag} 
                      size="sm"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-ncc-navy hover:bg-blue-800"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creating Mission...' : 'Submit Problem for Review'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Your submission will be reviewed by ANO officers
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostProblem;
