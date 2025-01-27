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
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      // Add markers for each location
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

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start spinning
    spinGlobe();

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