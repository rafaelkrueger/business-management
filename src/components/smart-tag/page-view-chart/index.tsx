import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import TrackingService from '../../../services/tracking.service.ts';

interface PageViewChartProps {
  apiKey: string;
}

const PageViewChart: React.FC<PageViewChartProps> = ({ apiKey }) => {
  // Inicializa com um objeto vazio para evitar erro de leitura
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await TrackingService.glancePageView(apiKey);
        const data = response.data; // Supondo que response.data seja um array de registros de page view

        // Agrupa os registros por data (usando o campo createdAt)
        const grouped: { [date: string]: number } = {};
        data.forEach((item: any) => {
          const date = new Date(item.createdAt).toLocaleDateString();
          grouped[date] = (grouped[date] || 0) + 1;
        });

        // Cria os labels ordenados (por data) e os respectivos contadores
        const labels = Object.keys(grouped).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        const counts = labels.map((label) => grouped[label]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Page Views',
              data: counts,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao buscar os dados de page view:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiKey]);

  if (loading) return <div>Carregando gráfico...</div>;

  // Caso não haja dados para exibir, mostra uma mensagem amigável
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <div>Nenhum dado para exibir</div>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Visualizações de Página</h3>
      <Line data={chartData} />
    </div>
  );
};

export default PageViewChart;
