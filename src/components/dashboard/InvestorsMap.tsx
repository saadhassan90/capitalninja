import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Note: You should replace this with your own Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHMxYTBtYmswMDFqMnFxbWw2MHY4YnFqIn0.LWLwJKwcTIkxm4JSzjkVYw';

const InvestorsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const { data: locationData } = useQuery({
    queryKey: ['investorLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('limited_partners')
        .select('hqlocation, hqcountry')
        .not('hqlocation', 'is', null);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!mapContainer.current || map) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'mercator',
        zoom: 1,
        center: [0, 20],
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      setMap(newMap);
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to load map');
    }

    return () => {
      map?.remove();
    };
  }, []);

  // Handle markers in a separate effect
  useEffect(() => {
    if (!map || !locationData) return;

    // Wait for map to be loaded
    map.on('load', () => {
      locationData.forEach((investor) => {
        if (investor.hqlocation) {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = '#8B5CF6';
          el.style.width = '10px';
          el.style.height = '10px';
          el.style.borderRadius = '50%';

          new mapboxgl.Marker(el)
            .setLngLat([0, 0]) // Default position, would need geocoding service for accurate positions
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3 class="text-sm font-medium">${investor.hqlocation}</h3>`)
            )
            .addTo(map);
        }
      });
    });
  }, [map, locationData]);

  if (mapError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investor Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center text-red-500">
            Failed to load map: {mapError}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorsMap;