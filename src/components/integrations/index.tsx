import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { SiUbereats, SiWordpress, SiShopify } from 'react-icons/si';
import ShopifyService from '../../services/shopify.service.ts';

// Lista de integrações com dados básicos
const integrations = [
  {
    name: 'Uber Eats',
    description: 'Integre com o Uber Eats para gerenciamento de pedidos e entregas.',
    icon: <SiUbereats size={40} />,
    color: '#06C167',
  },
  {
    name: 'WordPress',
    description: 'Gerencie conteúdos do seu site e blog através do WordPress.',
    icon: <SiWordpress size={40} />,
    color: '#21759B',
  },
  {
    name: 'Shopify',
    description: 'Sincronize sua loja online e gerencie produtos com o Shopify.',
    icon: <SiShopify size={40} />,
    color: '#7AB55C',
  },
];

// Componente para renderizar cada card de integração
const IntegrationCard = ({ integration, onConnect }) => (
  <Card
    sx={{
      minWidth: 275,
      borderRadius: 4,
      boxShadow: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      },
    }}
  >
    <CardContent sx={{ textAlign: 'center' }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          mx: 'auto',
          bgcolor: integration.color,
          color: 'white',
        }}
      >
        {integration.icon}
      </Avatar>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        {integration.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {integration.description}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
      <Button
        variant="contained"
        size="medium"
        sx={{
          borderRadius: 2,
          bgcolor: integration.color,
          '&:hover': {
            bgcolor: `${integration.color}CC`,
          },
        }}
        onClick={() => onConnect(integration)}
      >
        Connect
      </Button>
    </CardActions>
  </Card>
);

// Modal para integração com o Shopify
const ShopifyIntegrationModal = ({ open, onClose, companyId }) => {
  const [shopDomain, setShopDomain] = useState('');

  const handleConnect = async () => {
    try {
      // Chama o service para gerar o link de autenticação
      const response = await ShopifyService.getAuthLink(companyId, shopDomain);
      // Redireciona para o link de OAuth do Shopify
      window.location.href = response.data;
    } catch (error) {
      console.error('Erro ao conectar o Shopify:', error);
      alert('Erro ao iniciar integração com Shopify. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Integrar Shopify</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Insira o domínio da sua loja (ex.: minhaloja.myshopify.com) para iniciar a integração.
        </Typography>
        <TextField
          label="Domínio da Loja"
          value={shopDomain}
          onChange={(e) => setShopDomain(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConnect}>
          Conectar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Tela principal de integrações
const Integrations = () => {
  const [shopifyModalOpen, setShopifyModalOpen] = useState(false);
  const companyId = 'empresa-123'; // Exemplo: você pode obter esse valor do contexto/auth

  // Função chamada quando o usuário clica em "Connect"
  const handleConnect = async (integration) => {
    if (integration.name === 'Shopify') {
      try {
        // Verifica o status no backend
        const statusResponse = await ShopifyService.checkShopifyStatus(companyId);
        if (!statusResponse) {
          // Se não estiver integrado, abre o modal para integração
          setShopifyModalOpen(true);
        } else {
          alert('Shopify já está integrado.');
        }
      } catch (error) {
        console.error('Erro ao verificar integração do Shopify:', error);
        alert('Erro ao verificar integração. Tente novamente.');
      }
    } else {
      // Outras integrações podem seguir outros fluxos
      alert(`Integração com ${integration.name} não implementada neste exemplo.`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Integrações
      </Typography>
      <Grid container spacing={4}>
        {integrations.map((integration, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <IntegrationCard integration={integration} onConnect={handleConnect} />
          </Grid>
        ))}
      </Grid>
      <ShopifyIntegrationModal
        open={shopifyModalOpen}
        onClose={() => setShopifyModalOpen(false)}
        companyId={companyId}
      />
    </div>
  );
};

export default Integrations;
