import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaReddit,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  // RadialBarChart, etc., caso queira
} from "recharts";

// Seus modais de autenticação
import TwitterAuthModal from "../twitter/twitter-create/index.tsx";
import LinkedInAuthModal from "../linkedin-create/index.tsx";
import FacebookAuthModal from "../facebook-create/index.tsx";
import YouTubeAuthModal from "../youtube/youtube-create/index.tsx";
import WhatsAppAuthModal from "../whatsapp-create/index.tsx";

// Services (cada um faz uma chamada para checar se a conta está vinculada)
import FacebookService from "../../../services/facebook.service.ts";
import TwitterService from "../../../services/twitter.service.ts";
import YouTubeService from "../../../services/youtube.service.ts";
import LinkedinService from "../../../services/linkedin.service.ts";
import WhatsappService from "../../../services/whatsapp.service.ts";
import { Article, ThumbUp, TrendingUp, Visibility } from "@mui/icons-material";
import { FaComment } from "react-icons/fa";
import EngagementService from "../../../services/engagement.service.ts";

// Dados mockados para as redes (caso estejam conectadas)
const mockNetworkData = {
  Whatsapp: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Instagram: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Facebook: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Youtube: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  TikTok: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Twitter: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  LinkedIn: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Pinterest: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
  Reddit: [
    { name: "Engajamento", value: 0 },
    { name: "", value: 0 },
  ],
};

/**
 * MOCK de detalhes de cada rede social.
 * Poderia vir de um endpoint real. Aqui está apenas ilustrativo.
 */
const socialMediaDetails = {
  Twitter: {
    engagement: 0,
    impressions: 0,
    comments: 0,
    likes: 0,
    lastPosts: [
      { title: "Tweet A", date: "2023-07-10", engagement: 0 },
      { title: "Tweet B", date: "2023-07-09", engagement: 0 },
    ],
  },
  LinkedIn: {
    engagement: 0,
    impressions: 0,
    comments: 0,
    likes: 0,
    lastPosts: [
      { title: "Artigo X", date: "2023-07-11", engagement: 0 },
      { title: "Post Y", date: "2023-07-08", engagement: 0 },
    ],
  },
  Facebook: {
    engagement: 0,
    impressions: 0,
    comments: 0,
    likes: 0,
    lastPosts: [
      { title: "Post FB #1", date: "2023-07-10", engagement: 0 },
      { title: "Post FB #2", date: "2023-07-09", engagement: 0 },
    ],
  },
  // ... e assim por diante para cada rede
};

// Lista de redes sociais (cada uma com chave, nome, ícone e serviceCheck)
const socialNetworks = [
  {
    key: "twitter",
    name: "Twitter",
    icon: <FaTwitter style={{ color: "#1DA1F2", fontSize: 36 }} />,
    serviceCheck: TwitterService.checkTwitterStatus,
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    icon: <FaLinkedin style={{ color: "#0A66C2", fontSize: 36 }} />,
    serviceCheck: LinkedinService.checkLinkedinStatus,
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FaFacebook style={{ color: "#1877F2", fontSize: 36 }} />,
    serviceCheck: FacebookService.checkFacebookStatus,
  },
  {
    key: "youtube",
    name: "Youtube",
    icon: <FaYoutube style={{ color: "#FF0000", fontSize: 36 }} />,
    serviceCheck: YouTubeService.checkYoutubeStatus,
  },
  {
    key: "whatsapp",
    name: "Whatsapp",
    icon: <FaWhatsapp style={{ color: "#25D366", fontSize: 36 }} />,
    // serviceCheck: WhatsappService.checkWhatsappStatus,
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: <FaInstagram style={{ color: "#E4405F", fontSize: 36 }} />,
    // serviceCheck: InstagramService.checkInstagramStatus,
  },
  {
    key: "tiktok",
    name: "Tik Tok",
    icon: <FaTiktok style={{ color: "#000000", fontSize: 36 }} />,
    // serviceCheck: InstagramService.checkInstagramStatus,
  },
  // {
  //   key: "pinterest",
  //   name: "Pinterest",
  //   icon: <FaPinterest style={{ color: "#E4405F", fontSize: 36 }} />,
  //   // serviceCheck: InstagramService.checkInstagramStatus,
  // },
  // {
  //   key: "reddit",
  //   name: "Reddit",
  //   icon: <FaReddit style={{ color: "#2626ff", fontSize: 36 }} />,
  //   // serviceCheck: InstagramService.checkInstagramStatus,
  // },
  // ...
];

// Métricas gerais de exemplo
const totalEngajamento = 7200;
const totalSeguidores = 95000;
const crescimentoMedio = 12; // %

const engagementOverTime = [
  { day: "Mon", engajamento: 0 },
  { day: "Tue", engajamento: 0 },
  { day: "Wed", engajamento: 0 },
  { day: "Thu", engajamento: 0 },
  { day: "Fri", engajamento: 0 },
  { day: "Sat", engajamento: 0 },
  { day: "Sun", engajamento: 0 },
];

export const posts = [
    {
      title: "Dicas de Marketing Digital",
      date: "2025-02-01",
      likes: 120,
      comments: 15,
      shares: 8,
      imageUrl: "https://via.placeholder.com/300x150?text=Post+1",
    },
    {
      title: "Como Criar Conteúdo Relevante",
      date: "2025-02-05",
      likes: 98,
      comments: 20,
      shares: 5,
      imageUrl: "https://via.placeholder.com/300x150?text=Post+2",
    },
    {
      title: "Estratégias de SEO Atualizadas",
      date: "2025-02-07",
      likes: 150,
      comments: 30,
      shares: 10,
      imageUrl: "https://via.placeholder.com/300x150?text=Post+3",
    },
    {
      title: "Novidades no Instagram",
      date: "2025-02-10",
      likes: 200,
      comments: 40,
      shares: 12,
      imageUrl: "https://via.placeholder.com/300x150?text=Post+4",
    },
    {
      title: "Ferramentas de E-mail Marketing",
      date: "2025-02-12",
      likes: 85,
      comments: 12,
      shares: 2,
      imageUrl: "https://via.placeholder.com/300x150?text=Post+5",
    },
  ];


interface SocialMediaDashboardProps {
  activeCompany: string;
}

const SocialMediaDashboard: React.FC<SocialMediaDashboardProps> = ({ activeCompany }) => {
  const [networkStatus, setNetworkStatus] = useState<Record<string, boolean>>({});
  const [engagement, setEngagement] = useState([]);

  const [openTwitterAuthModal, setOpenTwitterAuthModal] = useState(false);
  const [openLinkedinAuthModal, setOpenLinkedinAuthModal] = useState(false);
  const [openFacebookAuthModal, setOpenFacebookAuthModal] = useState(false);
  const [openYoutubeAuthModal, setOpenYoutubeAuthModal] = useState(false);
  const [openWhatsappAuthModal, setOpenWhatsappAuthModal] = useState(false);

  // Para o modal de detalhes
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  // Ao clicar em "Ver Detalhes"
  const handleShowDetails = (networkName: string) => {
    setSelectedNetwork(networkName);
    setOpenDetailsModal(true);
  };

  // Função para fechar o modal de detalhes
  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedNetwork(null);
  };

  const handleSaveTwitterCredentials = (credentials) => {
    console.log("Credenciais salvas:", credentials);
  };

  const getIconForNetwork = (network) => {
    switch (network.toLowerCase()) {
      case "twitter":
        return <FaTwitter style={{ color: "#1DA1F2", fontSize: 20, marginRight: 8 }} />;
      case "linkedin":
        return <FaLinkedin style={{ color: "#0A66C2", fontSize: 20, marginRight: 8 }} />;
      case "facebook":
        return <FaFacebook style={{ color: "#1877F2", fontSize: 20, marginRight: 8 }} />;
      case "youtube":
        return <FaYoutube style={{ color: "#FF0000", fontSize: 20, marginRight: 8 }} />;
      case "whatsapp":
        return <FaWhatsapp style={{ color: "#25D366", fontSize: 20, marginRight: 8 }} />;
      case "instagram":
        return <FaInstagram style={{ color: "#E4405F", fontSize: 20, marginRight: 8 }} />;
      case "tiktok":
        return <FaTiktok style={{ color: "#000000", fontSize: 20, marginRight: 8 }} />;
      case "pinterest":
        return <FaPinterest style={{ color: "#E4405F", fontSize: 20, marginRight: 8 }} />;
      case "reddit":
        return <FaReddit style={{ color: "#FF4500", fontSize: 20, marginRight: 8 }} />;
      default:
        return null;
    }
  };

  const handleConnectNetwork = (networkKey: string) => {
    switch (networkKey) {
      case "twitter":
        setOpenTwitterAuthModal(true);
        break;
      case "linkedin":
        setOpenLinkedinAuthModal(true);
        break;
      case "facebook":
        setOpenFacebookAuthModal(true);
        break;
      case "youtube":
        setOpenYoutubeAuthModal(true);
        break;
      case "whatsapp":
        setOpenWhatsappAuthModal(true);
        break;
      default:
        alert(`Conexão para a rede "${networkKey}" não está implementada ainda.`);
    }
  };

  useEffect(() => {
    EngagementService.get(activeCompany)
    .then((res)=>{
      setEngagement(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })

    const checkNetworkStatus = async () => {
      const newStatus: Record<string, boolean> = {};

      for (const net of socialNetworks) {
        if (net.serviceCheck) {
          try {
            const isConnected = await net.serviceCheck(activeCompany);
            newStatus[net.key] = isConnected;
          } catch (err) {
            console.error(`Erro ao checar status de ${net.name}:`, err);
            newStatus[net.key] = false;
          }
        } else {
          newStatus[net.key] = false;
        }
      }
      setNetworkStatus(newStatus);
    };

    checkNetworkStatus();
  }, [activeCompany]);

  return (
    <>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{marginBottom:'20px'}}>Social Media Dashboard</Typography>

        {/* Gráfico de linha (Evolução do engajamento) */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey=""
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={2} sx={{ marginBottom: "50px" }}>
        {engagement.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                {item.image && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={item.image}
                      alt={`Imagem do engajamento da ${item.network}`}
                      style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                    />
                  </Box>
                )}
                  <Box display="flex" alignItems="center" mb={1}>
                    {getIconForNetwork(item.network)}
                    <Typography variant="h6">
                      {item.network.toUpperCase()}
                    </Typography>
                  </Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Data: {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Likes: {item.likes}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Comentários: {item.comments}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Compartilhamentos: {item.shares}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Impressões: {item.impressions}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

        <Grid container spacing={2}>
          {socialNetworks.map((network) => {
            const isConnected = networkStatus[network.key] === true;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={network.key}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {network.icon}
                    <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                      {network.name}
                    </Typography>

                    {isConnected ? (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* Gráfico básico de barras */}
                        <Box sx={{ width: "100%", height: 150 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockNetworkData[network.name]}>
                              <CartesianGrid strokeDasharray="2 2" stroke="#ddd" />
                              <XAxis dataKey="name" stroke="#666" />
                              <YAxis hide />
                              <Tooltip />
                              <defs>
                                <linearGradient
                                  id={`grad-${network.name}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#4A90E2"
                                    stopOpacity={0.9}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#4A90E2"
                                    stopOpacity={0.5}
                                  />
                                </linearGradient>
                              </defs>
                              <Bar
                                dataKey="value"
                                fill={`url(#grad-${network.name})`}
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>

                        {/* Botão de detalhes */}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleShowDetails(network.name)}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ marginTop: 1 }}
                        >
                          Esta rede ainda não foi conectada.
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ marginTop: 2 }}
                          onClick={() => handleConnectNetwork(network.key)}
                        >
                          Conectar
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <Dialog
      open={openDetailsModal}
      onClose={handleCloseDetails}
      maxWidth="sm"
      fullWidth
    >
      {/* CABEÇALHO DO MODAL */}
      <DialogTitle
        sx={{
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Article sx={{ mr: 1, color: "#1976d2" }} />
        Detalhes - {selectedNetwork || ""}
      </DialogTitle>

      {/* CONTEÚDO PRINCIPAL */}
      <DialogContent sx={{ bgcolor: "#fafafa" }}>
        {selectedNetwork && socialMediaDetails[selectedNetwork] ? (
          <Box sx={{ mt: 1 }}>
            {/* GRID PRINCIPAL COM OS CARDS DE ENGAJAMENTO, IMPRESSÕES, ETC. */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <TrendingUp sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle2" sx={{ color: "#616161" }}>
                        Engajamento
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {socialMediaDetails[selectedNetwork].engagement}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Visibility sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle2" sx={{ color: "#616161" }}>
                        Impressões
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {socialMediaDetails[selectedNetwork].impressions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <FaComment size={20} style={{ marginRight: 8, color: "#1976d2" }} />
                      <Typography variant="subtitle2" sx={{ color: "#616161" }}>
                        Comentários
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {socialMediaDetails[selectedNetwork].comments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <ThumbUp sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle2" sx={{ color: "#616161" }}>
                        Likes
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {socialMediaDetails[selectedNetwork].likes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* LISTA DE ÚLTIMOS POSTS */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Últimos Posts:
              </Typography>
              {socialMediaDetails[selectedNetwork].lastPosts.map((post, idx) => (
                <Card
                  key={idx}
                  elevation={1}
                  sx={{
                    mb: 2,
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575" }}>
                      {`Data: ${post.date} | Engajamento: ${post.engagement}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <DialogContentText sx={{ color: "#757575" }}>
            Nenhum detalhe encontrado para essa rede.
          </DialogContentText>
        )}
      </DialogContent>

      {/* AÇÕES DO MODAL */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDetails} variant="contained" color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>

      {/* MODAIS DE AUTENTICAÇÃO DAS REDES */}
      <TwitterAuthModal
        open={openTwitterAuthModal}
        onClose={() => setOpenTwitterAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />
      <LinkedInAuthModal
        open={openLinkedinAuthModal}
        onClose={() => setOpenLinkedinAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />
      <FacebookAuthModal
        open={openFacebookAuthModal}
        onClose={() => setOpenFacebookAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />
      <YouTubeAuthModal
        open={openYoutubeAuthModal}
        onClose={() => setOpenYoutubeAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />
      <WhatsAppAuthModal
        open={openWhatsappAuthModal}
        onClose={() => setOpenWhatsappAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />
    </>
  );
};

export default SocialMediaDashboard;
