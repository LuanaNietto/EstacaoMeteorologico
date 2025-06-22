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
  Wind,
  CloudRain,
  Sun,
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

  const fetchData = () => {
    const data = generateWeatherData();
    setCurrentData(data);
    setHistoricalData(generateHistoricalData(24));
    setLastUpdate(new Date().toLocaleTimeString());
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
          {/* <TabsTrigger value="vento" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
            Vento
          </TabsTrigger>
          <TabsTrigger value="chuva" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800">
            Probabilidade de Chuva
          </TabsTrigger>
          <TabsTrigger value="uv" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            Índice UV
          </TabsTrigger> */}
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

        {/* <TabsContent value="vento">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Velocidade do Vento"
                value={currentData.windSpeed}
                unit="km/h"
                icon={<Wind className="h-5 w-5 text-white" />}
                description="Velocidade média atual"
                colorClass="bg-yellow-700 text-white"
              />
              <MetricCard
                title="Velocidade Mínima"
                value={Math.min(...historicalData.windSpeed.map(w => w.value))}
                unit="km/h"
                icon={<Wind className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-green-700 text-white"
              />
              <MetricCard
                title="Velocidade Máxima"
                value={Math.max(...historicalData.windSpeed.map(w => w.value))}
                unit="km/h"
                icon={<Wind className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-yellow-700 text-white"
              />
            </div>
            <DataChart
              title="Velocidade do Vento nas Últimas 24 Horas"
              data={historicalData.windSpeed}
              color="#fbbf24"
              unit="km/h"
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </TabsContent>

        <TabsContent value="chuva">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Probabilidade de Chuva"
                value={currentData.rainProbability}
                unit="%"
                icon={<CloudRain className="h-5 w-5 text-white" />}
                description="Probabilidade atual de precipitação"
                colorClass="bg-blue-700 text-white"
              />
              <MetricCard
                title="Probabilidade Mínima"
                value={Math.min(...historicalData.rainProbability.map(r => r.value))}
                unit="%"
                icon={<CloudRain className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-yellow-700 text-white"
              />
              <MetricCard
                title="Probabilidade Máxima"
                value={Math.max(...historicalData.rainProbability.map(r => r.value))}
                unit="%"
                icon={<CloudRain className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-blue-700 text-white"
              />
            </div>
            <DataChart
              title="Probabilidade de Chuva nas Últimas 24 Horas"
              data={historicalData.rainProbability}
              color="#38bdf8"
              unit="%"
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </TabsContent>

        <TabsContent value="uv">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Índice UV Atual"
                value={currentData.uvIndex}
                unit=""
                icon={<Sun className="h-5 w-5 text-white" />}
                description="Nível de radiação ultravioleta"
                colorClass="bg-purple-700 text-white"
              />
              <MetricCard
                title="Índice UV Mínimo"
                value={Math.min(...historicalData.uvIndex.map(u => u.value))}
                unit=""
                icon={<Sun className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-blue-700 text-white"
              />
              <MetricCard
                title="Índice UV Máximo"
                value={Math.max(...historicalData.uvIndex.map(u => u.value))}
                unit=""
                icon={<Sun className="h-5 w-5 text-white" />}
                description="Nas últimas 24 horas"
                colorClass="bg-red-700 text-white"
              />
            </div>
            <DataChart
              title="Índice UV nas Últimas 24 Horas"
              data={historicalData.uvIndex}
              color="#c084fc"
              unit=""
              valueFormatter={(value) => value.toFixed(0)}
            />
          </div>
        </TabsContent> */}
      </Tabs>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Estação Meteorológica</p>
      </footer>
    </div>
  );
}
