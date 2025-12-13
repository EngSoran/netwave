"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

interface IpData {
  ip: string;
  country_name: string;
  country_code: string;
}

export default function IpDetector() {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIpData({
          ip: data.ip,
          country_name: data.country_name,
          country_code: data.country_code,
        });
      } catch (error) {
        console.error('Error fetching IP data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpData();
  }, []);

  if (loading) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-white/60 text-sm">
        <Globe className="w-4 h-4 animate-pulse" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (!ipData) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-white/80 text-sm hover:text-white transition-colors">
      <Globe className="w-4 h-4" />
      <span className="whitespace-nowrap">
        أنت تتصفح من {ipData.country_name}
      </span>
      <span className="text-white/50">|</span>
      <span className="text-white/60 font-mono text-xs">{ipData.ip}</span>
    </div>
  );
}
