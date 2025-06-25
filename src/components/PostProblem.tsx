
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Camera, MapPin, Plus, Navigation, Map } from "lucide-react";
import { useCreateProblem } from "@/hooks/useProblems";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PostProblemProps {
  onBack: () => void;
}

const PostProblem = ({ onBack }: PostProblemProps) => {
  const createProblemMutation = useCreateProblem();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    location: '',
    tags: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high',
    level: 'level1' as 'level1' | 'level2' | 'level3'
  });
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  const [newTag, setNewTag] = useState('');

  const suggestedTags = [
    'Infrastructure', 'Safety', 'Environment', 'Education', 
    'Health', 'Community', 'Traffic', 'Waste', 'Digital', 'Youth'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      await createProblemMutation.mutateAsync({
        ...problemData,
        postedBy: user.id
      });
      
      toast({
        title: 'Mission Created!',
        description: 'Your problem has been submitted for review.',
      });
      onBack();
    } catch (error) {
      toast({
        title: 'Error creating mission',
        description: error instanceof Error ? error.message : 'Failed to create problem',
        variant: 'destructive'
      });
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

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: 'Location not supported',
        description: 'Your browser does not support location services',
        variant: 'destructive'
      });
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.results[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setProblemData({...problemData, location: address});
          } else {
            // Fallback to coordinates
            setProblemData({...problemData, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`});
          }
          
          toast({
            title: 'Location found',
            description: 'Current location has been set'
          });
        } catch (error) {
          // Fallback to coordinates
          setProblemData({...problemData, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`});
          toast({
            title: 'Location set',
            description: 'Location set using coordinates'
          });
        }
        
        setLocationLoading(false);
      },
      (error) => {
        let message = 'Failed to get location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information unavailable';
        }
        
        toast({
          title: 'Location error',
          description: message,
          variant: 'destructive'
        });
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const MapModal = () => {
    if (!showMapModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Select Location on Map</h3>
            <Button variant="ghost" onClick={() => setShowMapModal(false)}>×</Button>
          </div>
          <div className="p-4">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Interactive map will be here</p>
                <p className="text-sm text-gray-500">Click to select location</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter location manually"
                value={problemData.location}
                onChange={(e) => setProblemData({...problemData, location: e.target.value})}
                className="flex-1"
              />
              <Button onClick={() => setShowMapModal(false)}>Done</Button>
            </div>
          </div>
        </div>
      </div>
    );
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
                <div className="space-y-2">
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
                  
                  {/* Location Options */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={loading || locationLoading}
                      className="flex-1"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMapModal(true)}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Mark on Map
                    </Button>
                  </div>
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
        
        {/* Map Modal */}
        <MapModal />
      </div>
    </div>
  );
};

export default PostProblem;
