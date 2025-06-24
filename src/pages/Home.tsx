import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MetricCard } from "../components/MetricCard";
import { DataChart } from "../components/DataChart";
import { generateWeatherData, generateHistoricalData } from "../lib/data";
import { WeatherData, WeatherHistoryData } from "../types";
import {
  Thermometer,
  Droplets,
  Gauge,
  RefreshCw
} from "lucide-react";

export default function Home() {
  const [currentData, setCurrentData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<WeatherHistoryData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/weather');
      const data = await response.json();
      setCurrentData(data);
      const responseHist = await fetch('http://localhost:3001/api/weather/minmax');
      const dataHist = await responseHist.json();
      setHistoricalData(dataHist);
      // setHistoricalData(generateHistoricalData(24));
      setLastUpdate(data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString());
    } catch (error) {
      // fallback para dados aleatórios se a API não responder
      const data = generateWeatherData();
      setCurrentData(data);
      setHistoricalData(generateHistoricalData(24));
      setLastUpdate(new Date().toLocaleTimeString());
    }
  };

  if (!currentData || !historicalData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#faf9f7]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg">Carregando dados do Arduino...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Estação Meteorológica Inteligente</h1>
            <p className="text-gray-600">Monitoramento em tempo real das condições climáticas</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Atualizar Dados
            </button>
            <p className="text-xs text-gray-500 mt-1">Última atualização: {lastUpdate}</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="temperatura" className="w-full">
        <TabsList className="w-full flex flex-wrap justify-start mb-6 bg-[#faf9f7] border-b border-gray-200">
          <TabsTrigger value="temperatura" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
            Temperatura
          </TabsTrigger>
          <TabsTrigger value="umidade" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            Umidade
          </TabsTrigger>
          <TabsTrigger value="pressao" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            Pressão Atmosférica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="temperatura">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Temperatura Atual"
                value={currentData.temperature}
                unit="°C"
                icon={<Thermometer className="h-5 w-5 text-white" />}
                description="Medida ao nível do solo"
                colorClass="bg-red-700 text-white"
              />
              <MetricCard
                title="Temperatura Mínima"
                value={Math.min(...historicalData.temperature.map(t => t.value))}
                unit="°C"
                icon={<Thermometer className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-blue-700 text-white"
              />
              <MetricCard
                title="Temperatura Máxima"
                value={Math.max(...historicalData.temperature.map(t => t.value))}
                unit="°C"
                icon={<Thermometer className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-red-700 text-white"
              />
            </div>
            <DataChart
              title="Temperatura nas Últimas 24 Horas"
              data={historicalData.temperature}
              color="#ff9b50"
              unit="°C"
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </TabsContent>

        <TabsContent value="umidade">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Umidade Atual"
                value={currentData.humidity}
                unit="%"
                icon={<Droplets className="h-5 w-5 text-white" />}
                description="Umidade relativa do ar"
                colorClass="bg-blue-700 text-white"
              />
              <MetricCard
                title="Umidade Mínima"
                value={Math.min(...historicalData.humidity.map(h => h.value))}
                unit="%"
                icon={<Droplets className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-yellow-700 text-white"
              />
              <MetricCard
                title="Umidade Máxima"
                value={Math.max(...historicalData.humidity.map(h => h.value))}
                unit="%"
                icon={<Droplets className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-blue-700 text-white"
              />
            </div>
            <DataChart
              title="Umidade nas Últimas 24 Horas"
              data={historicalData.humidity}
              color="#60a5fa"
              unit="%"
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </TabsContent>

        <TabsContent value="pressao">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Pressão Atual"
                value={currentData.pressure}
                unit="hPa"
                icon={<Gauge className="h-5 w-5 text-white" />}
                description="Pressão atmosférica ao nível do mar"
                colorClass="bg-green-700 text-white"
              />
              <MetricCard
                title="Pressão Mínima"
                value={Math.min(...historicalData.pressure.map(p => p.value))}
                unit="hPa"
                icon={<Gauge className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-red-700 text-white"
              />
              <MetricCard
                title="Pressão Máxima"
                value={Math.max(...historicalData.pressure.map(p => p.value))}
                unit="hPa"
                icon={<Gauge className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-green-700 text-white"
              />
            </div>
            <DataChart
              title="Pressão Atmosférica nas Últimas 24 Horas"
              data={historicalData.pressure}
              color="#34d399"
              unit="hPa"
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Estação Meteorológica</p>
      </footer>
    </div>
  );
}
