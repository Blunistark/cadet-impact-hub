
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Navigation, ExternalLink } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  status: 'active' | 'in-progress' | 'completed';
  tags: string[];
}

interface MapViewProps {
  onBack: () => void;
}

const MapView = ({ onBack }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const mockProblems: Problem[] = [
    {
      id: '1',
      title: 'Street Light Repair Needed',
      location: 'MG Road, Bangalore',
      coordinates: [12.9716, 77.5946],
      status: 'active',
      tags: ['Infrastructure', 'Safety']
    },
    {
      id: '2',
      title: 'Community Garden Initiative',
      location: 'Christ University, Bangalore',
      coordinates: [12.9342, 77.6101],
      status: 'in-progress',
      tags: ['Environment', 'Community']
    },
    {
      id: '3',
      title: 'Digital Literacy for Elderly',
      location: 'Jayanagar, Bangalore',
      coordinates: [12.9279, 77.5619],
      status: 'active',
      tags: ['Education', 'Digital']
    }
  ];

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize Leaflet map
      const L = (window as any).L;
      mapInstance.current = L.map(mapRef.current).setView([12.9716, 77.5946], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add markers for problems
      mockProblems.forEach((problem) => {
        const markerColor = problem.status === 'active' ? 'green' : 
                           problem.status === 'in-progress' ? 'orange' : 'blue';
        
        const marker = L.marker(problem.coordinates).addTo(mapInstance.current);
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${problem.title}</h3>
            <p style="margin: 0 0 8px 0; color: #666;">${problem.location}</p>
            <div style="margin-bottom: 8px;">
              <span style="background: ${markerColor}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 12px;">
                ${problem.status}
              </span>
            </div>
            <button onclick="selectProblem('${problem.id}')" 
                    style="background: #1e3a8a; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              View Details
            </button>
          </div>
        `);
      });

      // Make selectProblem available globally for popup buttons
      (window as any).selectProblem = (id: string) => {
        const problem = mockProblems.find(p => p.id === id);
        setSelectedProblem(problem || null);
      };
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const openInGoogleMaps = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-ncc text-white p-4">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mr-3 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Mission Map</h1>
        </div>
        <p className="text-blue-100 text-sm">Explore missions in your area</p>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef}
          className="w-full h-96 bg-gray-200"
          style={{ minHeight: '400px' }}
        />
        
        {/* Current Location Button */}
        <Button
          size="sm"
          className="absolute bottom-4 right-4 bg-white text-ncc-navy border shadow-lg hover:bg-gray-50"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                if (mapInstance.current) {
                  const L = (window as any).L;
                  mapInstance.current.setView([latitude, longitude], 15);
                  L.marker([latitude, longitude])
                    .addTo(mapInstance.current)
                    .bindPopup('Your Location')
                    .openPopup();
                }
              });
            }
          }}
        >
          <Navigation className="w-4 h-4 mr-1" />
          My Location
        </Button>
      </div>

      {/* Problem Details Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <Card className="w-full max-w-md m-4 mb-0 rounded-b-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedProblem.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedProblem.location}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProblem(null)}
                  className="text-gray-500"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getStatusColor(selectedProblem.status)}>
                  {selectedProblem.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInGoogleMaps(selectedProblem.coordinates)}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open in Google Maps
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedProblem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-ncc-navy hover:bg-blue-800">
                  Join Mission
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedProblem(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mission Status Legend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-around text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Active
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                In Progress
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapView;
