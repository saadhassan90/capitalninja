import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const InvestorsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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
    if (!mapContainer.current || !locationData) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGhhc3NhbjkwIiwiYSI6ImNscnpwbWVwZjE2MWsyam1qZnJ0ZGxqbmwifQ.SBt_iO5nEyqh98JfXjqHrA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'mercator',
      zoom: 1,
      center: [0, 20],
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add markers for each location
    map.current.on('load', () => {
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
            .addTo(map.current!);
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [locationData]);

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