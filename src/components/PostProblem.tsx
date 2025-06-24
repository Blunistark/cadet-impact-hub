
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Camera, MapPin, Plus } from "lucide-react";

interface PostProblemProps {
  onSubmit: (problemData: any) => void;
  onBack: () => void;
}

const PostProblem = ({ onSubmit, onBack }: PostProblemProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(problemData);
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
              {/* Photo Upload */}
              <div>
                <Label>Add Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Tap to add photos of the problem</p>
                  <Button variant="outline" className="mt-2" type="button">
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Problem Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Broken street lights on MG Road"
                  value={problemData.title}
                  onChange={(e) => setProblemData({...problemData, title: e.target.value})}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem in detail. Include impact on community, urgency, and any relevant context..."
                  value={problemData.description}
                  onChange={(e) => setProblemData({...problemData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Enter location or use current location"
                    value={problemData.location}
                    onChange={(e) => setProblemData({...problemData, location: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2" type="button">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
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
                          onClick={() => removeTag(tag)}
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
                          onClick={() => addTag(tag)}
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
                    />
                    <Button type="button" onClick={addCustomTag} size="sm">
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
                >
                  Post Problem & Start Mission
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  This will create a new mission for other cadets to join
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
