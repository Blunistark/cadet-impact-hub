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
  const [mapLoaded, setMapLoaded] = useState(false);

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
    let leafletLoaded = false;
    
    const initializeMap = () => {
      if (!mapRef.current || mapInstance.current || !leafletLoaded) return;
      
      const L = (window as any).L;
      if (!L || !L.map) return;

      try {
        // Create map instance
        mapInstance.current = L.map(mapRef.current, {
          center: [12.9716, 77.5946],
          zoom: 13,
          zoomControl: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(mapInstance.current);

        // Add markers
        mockProblems.forEach((problem) => {
          const marker = L.marker(problem.coordinates).addTo(mapInstance.current);
          
          const popupContent = `
            <div style="min-width: 200px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${problem.title}</h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${problem.location}</p>
              <div style="margin-bottom: 8px;">
                <span style="background: ${problem.status === 'active' ? '#22c55e' : problem.status === 'in-progress' ? '#f59e0b' : '#3b82f6'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: capitalize;">
                  ${problem.status.replace('-', ' ')}
                </span>
              </div>
              <button onclick="window.selectProblem('${problem.id}')" 
                      style="background: #1e40af; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%;">
                View Details
              </button>
            </div>
          `;
          
          marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
          });
        });

        // Global function for popup buttons
        (window as any).selectProblem = (id: string) => {
          const problem = mockProblems.find(p => p.id === id);
          setSelectedProblem(problem || null);
        };

        setMapLoaded(true);
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const loadLeaflet = () => {
      if ((window as any).L) {
        leafletLoaded = true;
        initializeMap();
        return;
      }

      // Add CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Add JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      
      script.onload = () => {
        leafletLoaded = true;
        setTimeout(initializeMap, 100); // Small delay to ensure DOM is ready
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Leaflet:', error);
      };
      
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
          mapInstance.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, []);

  const openInGoogleMaps = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstance.current && (window as any).L) {
          const L = (window as any).L;
          mapInstance.current.setView([latitude, longitude], 15);
          L.marker([latitude, longitude])
            .addTo(mapInstance.current)
            .bindPopup('Your Location')
            .openPopup();
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your location settings.');
      }
    );
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
      <div className="bg-gradient-to-r from-ncc-navy to-blue-700 text-white p-4">
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
          className="w-full bg-gray-200"
          style={{ height: '400px' }}
        />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ncc-navy mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            className="bg-white text-ncc-navy border shadow-lg hover:bg-gray-50"
            onClick={getCurrentLocation}
          >
            <Navigation className="w-4 h-4 mr-1" />
            My Location
          </Button>
          
          <Button
            size="sm"
            className="bg-ncc-green text-white shadow-lg hover:bg-green-700"
            onClick={() => {
              const center = mapInstance.current?.getCenter();
              if (center) {
                openInGoogleMaps([center.lat, center.lng]);
              } else {
                openInGoogleMaps([12.9716, 77.5946]);
              }
            }}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Google Maps
          </Button>
        </div>
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
                  {selectedProblem.status.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedProblem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full bg-ncc-navy hover:bg-blue-800"
                  onClick={() => openInGoogleMaps(selectedProblem.coordinates)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
                <Button className="w-full bg-ncc-green hover:bg-green-700 text-white">
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