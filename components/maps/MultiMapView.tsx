"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Maximize, Minimize } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UTMLatLng from "utm-latlng";

interface PuntoUTM {
  id: string | number;
  norte: number;
  este: number;
  label?: string;
}

interface PuntoProcesado extends PuntoUTM {
  latLng: [number, number];
}

const customIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -30],
});

function MapController({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 }); // Padding interno del zoom
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [map, coords]);
  return null;
}

export default function MultiMapView({ puntos }: { puntos: PuntoUTM[] }) {
  const [mounted, setMounted] = useState(false);
  const [mapStyle, setMapStyle] = useState<"claro" | "oscuro" | "satelite">("satelite");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processedPoints = useMemo(() => {
    const utm = new UTMLatLng();
    return puntos.reduce((acc: PuntoProcesado[], p: PuntoUTM) => {
      let result = utm.convertUtmToLatLng(p.este, p.norte, 19, "S");
      if (result && typeof result === "object" && "lat" in result) {
        let lat = result.lat;
        let lng = result.lng;
        if (lat > 0) {
          const corr = utm.convertUtmToLatLng(p.este, p.norte - 10000000, 19, "N");
          if (corr && typeof corr === "object" && "lat" in corr) {
            lat = corr.lat;
            lng = corr.lng;
          }
        }
        acc.push({ ...p, latLng: [lat, lng] as [number, number] });
      }
      return acc;
    }, []);
  }, [puntos]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  if (!mounted) return <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded-lg" />;

  const allLatLngs = processedPoints.map((p) => p.latLng);

  return (
    // 1. Contenedor Externo: Da el "aire" (padding) dentro de la Card
    <div className={`w-full ${isFullscreen ? "" : "p-4"}`}>
      {/* 2. Contenedor del Mapa: Define el tamaño estético del mapa */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-900 transition-all border border-black/5 dark:border-white/10 ${
          isFullscreen ? "h-screen w-screen" : "h-[250px] md:h-[350px] rounded-lg shadow-inner" // Altura reducida y bordes más redondeados
        }`}
      >
        {/* Controles Compactos - Ajustado su posicionamiento */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex justify-between pointer-events-none">
          <div className="flex gap-0.5 p-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 pointer-events-auto">
            {(["claro", "oscuro", "satelite"] as const).map((s) => (
              <button key={s} onClick={() => setMapStyle(s)} className={`px-2 py-1 text-[9px] font-bold uppercase rounded-sm transition-all ${mapStyle === s ? "bg-violet-600 text-white shadow-md" : "text-gray-300 hover:text-white"}`}>
                {s[0]}
                <span className="hidden sm:inline">{s.slice(1)}</span>
              </button>
            ))}
          </div>

          <button onClick={toggleFullscreen} className="p-1.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-white pointer-events-auto">
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>

        <MapContainer
          center={allLatLngs[0] || [-33.4489, -70.6693]}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false} // Ocultar atribución para estética
        >
          <TileLayer
            key={mapStyle}
            url={mapStyle === "satelite" ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" : mapStyle === "oscuro" ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
          />

          {processedPoints.map((p) => (
            <Marker key={p.id} position={p.latLng} icon={customIcon}>
              <Popup>
                <div className="p-0.5 min-w-[120px] font-sans">
                  <p className="font-bold text-violet-600 uppercase text-[10px]">{p.label}</p>
                  <p className="text-[9px] text-gray-500 font-mono">
                    N:{p.norte} E:{p.este}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          <MapController coords={allLatLngs} />
        </MapContainer>
      </div>
    </div>
  );
}
