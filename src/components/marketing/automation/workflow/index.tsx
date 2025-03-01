import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AutomationService from "../../../../services/automation.service.ts";
import EmailService from "../../../../services/email.service.ts";
import EmailConfigurationModal from "../../email-config/index.tsx";
import EmailTemplateSelector from "../../email-template-selector/index.tsx"; // ajuste o path conforme sua estrutura
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import AiService from "../../../../services/ai.service.ts";
import { Brain } from "lucide-react";
import { FaEnvelope, FaTwitter, FaLinkedin, FaYoutube, FaFacebook, FaWhatsapp, FaBrain, FaClock } from 'react-icons/fa';

import TwitterService from '../../../../services/twitter.service.ts';
import LinkedinService from "../../../../services/linkedin.service.ts";
import FacebookService from "../../../../services/facebook.service.ts";
import YoutubeService from "../../../../services/youtube.service.ts";

import LinkedInAuthModal from "../../linkedin-create/index.tsx";
import FacebookAuthModal from "../../facebook-create/index.tsx";
import WhatsAppAuthModal from "../../whatsapp-create/index.tsx";
import YouTubeAuthModal from "../../youtube/youtube-create/index.tsx";
import TwitterAuthModal from "../../twitter/twitter-create/index.tsx";

import TwitterNodeEditor from "../../twitter/twitter-post/index.tsx";
import YouTubeNodeEditor from "../../youtube/youtube-post/index.tsx";
import FacebookNodeEditor from "../../facebook/facebook-post/index.tsx";

const nodeStyles = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "#fff",
  textAlign: "center",
  minWidth: "150px",
};

const CustomNode = ({ data, id }) => {
  const { t } = useTranslation();
  return (
    <Paper style={{ ...nodeStyles, position: "relative" }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", width: "12px", height: "12px" }}
      />
      <Typography variant="body1">{data.label}</Typography>

      {data.blockType === "twitter" && (
        <Typography variant="body2" color="primary">
          <FaTwitter style={{marginBottom:'-3px'}} size={20} color="#1DA1F2" /> {data.params.tweetTitle || t("automationFlow.tweetTitle")}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mt: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => data.onEdit(id)}
          sx={{
            bgcolor: "#e3f2fd",
            "&:hover": { bgcolor: "#bbdefb" },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => data.onDelete(id)}
          sx={{
            bgcolor: "#ffebee",
            "&:hover": { bgcolor: "#ffcdd2" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555", width: "12px", height: "12px" }}
      />
    </Paper>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Função auxiliar para ordenar os nodes de forma topológica
const getSortedNodes = (nodes, edges) => {
  const nodeMap = {};
  nodes.forEach((node) => {
    nodeMap[node.id] = { ...node, indegree: 0, children: [] };
  });

  edges.forEach((edge) => {
    if (nodeMap[edge.target]) {
      nodeMap[edge.target].indegree++;
    }
    if (nodeMap[edge.source]) {
      nodeMap[edge.source].children.push(edge.target);
    }
  });

  const queue = [];
  for (const id in nodeMap) {
    if (nodeMap[id].indegree === 0) {
      queue.push(nodeMap[id]);
    }
  }

  const sortedNodes = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sortedNodes.push(current);
    current.children.forEach((childId) => {
      nodeMap[childId].indegree--;
      if (nodeMap[childId].indegree === 0) {
        queue.push(nodeMap[childId]);
      }
    });
  }

  if (sortedNodes.length !== nodes.length) {
    console.warn("Graph has a cycle. Returning unsorted nodes.");
    return nodes;
  }

  return sortedNodes.map(({ children, indegree, ...node }) => node);
};

const AutomationFlow = ({ activeCompany, setIsCreating, editingAutomation }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Estados para fluxo
  const [flowName, setFlowName] = useState("");
  const [nextExecutionTime, setNextExecutionTime] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState("");
  const [openTwitterAuthModal, setOpenTwitterAuthModal] = useState(false);
  const [openLinkedinAuthModal, setOpenLinkedinAuthModal] = useState(false);
  const [openYoutubeAuthModal, setOpenYoutubeAuthModal] = useState(false);
  const [openWhatsappAuthModal, setOpenWhatsappAuthModal] = useState(false);
  const [openFacebookAuthModal, setOpenFacebookAuthModal] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [hasTwitterCredentials, setHasTwitterCredentials] = useState(false);
  const [loadingTwitterCheck, setLoadingTwitterCheck] = useState(true);
  const [facebookPages, setFacebookPages] = useState([]);


  const [openEmailConfigModal, setOpenEmailConfigModal] = useState(false);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);

  const BLOCK_TYPES = {
    EMAIL: {
      type: "email",
      name: t("block.email"),
      icon: <FaEnvelope style={{ color: "#b4a01b", fontSize: 26 }} />,
      params: { recipients: "", subject: "", template: {} },
    },
    TWITTER: {
      type: "twitter",
      name: t("block.twitter"),
      icon: <FaTwitter style={{ color: "#1DA1F2", fontSize: 26 }} />,
      params: { tweetContent: "" },
    },
    LINKEDIN: {
      type: "linkedin",
      name: t("block.linkedin"),
      icon: <FaLinkedin style={{ color: "#0A66C2", fontSize: 26 }} />,
      params: { linkedinContent: "" },
    },
    YOUTUBE: {
      type: "youtube",
      name: t("block.youtube"),
      icon: <FaYoutube style={{ color: "#FF0000", fontSize: 26 }} />,
      params: { youtubeContent: "" },
    },
    FACEBOOK: {
      type: "facebook",
      name: t("block.facebook"),
      icon: <FaFacebook style={{ color: "#1877F2", fontSize: 26 }} />,
      params: { facebookContent: "" },
    },
    // Caso deseje habilitar o WhatsApp, descomente o bloco abaixo:
    // WHATSAPP: {
    //   type: "whatsapp",
    //   name: t("block.whatsapp"),
    //   icon: <FaWhatsapp style={{ color: "#25D366", fontSize: 36 }} />,
    //   params: { whatsappContent: "" },
    // },
    CHATGPT: {
      type: "chatgpt",
      name: t("block.chatgpt"),
      icon: <Brain style={{ color: "purple", fontSize: 26 }} />,
      params: {
        action: "generateContent",
        platform: "chat_gpt",
        tone: "neutral",
        keywords: "",
      },
    },
    WAIT: {
      type: "wait",
      name: t("block.wait"),
      icon: <FaClock style={{ color: "#000", fontSize: 26 }} />,
      params: { waitTime: 1, waitHours: 0 },
    },
  };

  useEffect(() => {
    const checkTwitterCredentials = async () => {
      setLoadingTwitterCheck(true);
      try {
        const response = await TwitterService.get(activeCompany);
        console.log("Twitter Credentials Response:", response.data);
        if (response.data && response.data.accessToken) {
          setHasTwitterCredentials(true);
        } else {
          setHasTwitterCredentials(false);
        }
      } catch (error) {
        console.error("Erro ao verificar credenciais do Twitter:", error);
        setHasTwitterCredentials(false);
      }
      setLoadingTwitterCheck(false);
    };

    if (activeCompany) {
      checkTwitterCredentials();
    }
  }, [activeCompany]);

  useEffect(() => {
    if (editingNode && editingNode.data.blockType === "facebook") {
      FacebookService.checkFacebookPages(activeCompany)
        .then((response) => {
          setFacebookPages(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar páginas do Facebook:", error);
        });
    }
  }, [editingNode, activeCompany]);

  const handleAddTwitterBlock = async () => {
    try {
      const response = await TwitterService.checkTwitterStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.TWITTER);
      } else {
        enqueueSnackbar(t("automationFlow.twitterConnectNeeded"), {
          variant: "warning",
        });
        setOpenTwitterAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenTwitterAuthModal(true);
    }
  };

  const handleAddLinkedinBlock = async () => {
    try {
      const response = await LinkedinService.checkLinkedinStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.LINKEDIN);
      } else {
        enqueueSnackbar(t("automationFlow.linkedinConnectNeeded"), {
          variant: "warning",
        });
        setOpenLinkedinAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenLinkedinAuthModal(true);
    }
  };

  const handleAddFacebookBlock = async () => {
    try {
      const response = await FacebookService.checkFacebookStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.FACEBOOK);
      } else {
        enqueueSnackbar(t("automationFlow.facebookConnectNeeded"), {
          variant: "warning",
        });
        setOpenFacebookAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenFacebookAuthModal(true);
    }
  };

  const handleAddYoutubeBlock = async () => {
    try {
      const response = await YoutubeService.checkYoutubeStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.YOUTUBE);
      } else {
        enqueueSnackbar(t("automationFlow.youtubeConnectNeeded"), {
          variant: "warning",
        });
        setOpenYoutubeAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenYoutubeAuthModal(true);
    }
  };

  const handleAddWhatsappBlock = async () => {
    try {
      const response = await WhatsappService.checkWhatsappStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.WHATSAPP);
      } else {
        enqueueSnackbar(t("automationFlow.whatsappConnectNeeded"), {
          variant: "warning",
        });
        setOpenWhatsappAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenWhatsappAuthModal(true);
    }
  };

  const handleSaveTwitterCredentials = async (config) => {
    // Lógica para salvar credenciais do Twitter
  };

  useEffect(() => {
    if (editingAutomation) {
      setFlowName(editingAutomation.name);
      setNextExecutionTime(editingAutomation.nextExecutionTime?.slice(0, 16));
      setRepeatInterval(editingAutomation.repeatInterval);

      const mappedNodes = editingAutomation.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      }));
      setNodes(mappedNodes);
      setEdges(editingAutomation.edges || []);
    }
  }, [editingAutomation]);

  useEffect(() => {
    if (openEditDialog) {
      const node = nodes.find((node) => node.id === openEditDialog);
      if (node) {
        setEditingNode(node);
      }
    }
  }, [openEditDialog, nodes]);

  // Quando o nó em edição for do tipo "email", buscamos os templates
  useEffect(() => {
    if (editingNode && editingNode.data.blockType === "email") {
      AutomationService.getEmailTemplates()
        .then((res) => {
          // Supondo que a resposta esteja em res.data
          setEmailTemplates(res.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar email templates:", error);
        });
    }
  }, [editingNode]);

  const addNode = (block) => {
    const newNode = {
      id: uuidv4(),
      type: "custom",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: block.name,
        blockType: block.type,
        params: block.params,
        onEdit: handleEdit,
        onDelete: handleDelete,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDelete = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const handleEdit = (nodeId) => {
    setOpenEditDialog(nodeId);
  };

  const handleSaveEdit = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? { ...node, data: { ...editingNode.data } }
          : node
      )
    );
    setOpenEditDialog("");
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { strokeWidth: 3 } }, eds)
      ),
    []
  );

  const handleSaveAutomation = async () => {
    const automationData = {
      name: flowName,
      // Ordena os nodes com base nas conexões antes de enviar
      nodes: getSortedNodes(nodes, edges),
      edges,
      nextExecutionTime,
      repeatInterval,
      activeCompany: activeCompany,
    };

    try {
      if (editingAutomation) {
        await AutomationService.editAutomation({
          ...automationData,
          id: editingAutomation.id,
          status: "PENDING",
        });
        enqueueSnackbar(t("marketing.automation.updated"), {
          variant: "success",
        });
      } else {
        await AutomationService.createAutomation(automationData);
        enqueueSnackbar(t("marketing.automation.created"), {
          variant: "success",
        });
      }
      setIsCreating(false);
    } catch (error) {
      console.error("Erro ao salvar automação:", error);
    }
  };

  const handleTestAutomation = async () => {
    const automationData = {
      name: flowName,
      // Ordena os nodes também para o teste
      nodes: getSortedNodes(nodes, edges),
      edges,
      nextExecutionTime,
      repeatInterval,
      activeCompany: activeCompany,
      testing: true,
    };

    try {
      await AutomationService.createAutomation(automationData);
      enqueueSnackbar(t("marketing.automation.testing"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao salvar automação:", error);
    }
  };

  const handleAddEmailBlock = async () => {
    try {
      const response = await EmailService.getAccount(activeCompany);
      if (response.data) {
        addNode(BLOCK_TYPES.EMAIL);
      } else {
        setOpenEmailConfigModal(true);
      }
    } catch (error) {
      setOpenEmailConfigModal(true);
    }
  };

  const handleSaveEmailConfig = async (config) => {
    try {
      const response = await EmailService.createAccount(config);
      console.log("Conta de e-mail criada com sucesso:", response.data);
      setOpenEmailConfigModal(false);
      // Após salvar a configuração, adiciona o nó de e-mail
      addNode(BLOCK_TYPES.EMAIL);
    } catch (error) {
      console.error("Erro ao criar conta de e-mail:", error);
    }
  };

  // Callback chamado quando um template é selecionado
  const handleTemplateSelect = (template) => {
    setEditingNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        params: {
          ...prev.data.params,
          template: { id: template.id, htmlContent: template.htmlContent },
        },
      },
    }));
    setOpenTemplateSelector(false);
  };

  const isConnectedToChatGPT = (emailNodeId) => {
    return edges.some((edge) => {
      return (
        edge.target === emailNodeId &&
        nodes.find(
          (node) => node.id === edge.source && node.data.blockType === "chatgpt"
        )
      );
    });
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
    <Box
      sx={{
        backgroundColor: "#fafafa",
        padding: 3,
        borderBottom: "2px solid #e0e0e0",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        {t("automationFlow.title")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
        <TextField
          label={t("automationFlow.flowName")}
          variant="outlined"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          fullWidth
        />
        <TextField
          label={t("automationFlow.executionTime")}
          variant="outlined"
          type="datetime-local"
          value={nextExecutionTime}
          onChange={(e) => setNextExecutionTime(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("automationFlow.repeatInterval")}
          variant="outlined"
          type="number"
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(e.target.value)}
          fullWidth
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            overflowX: "auto",
          }}
        >
          {Object.values(BLOCK_TYPES).map((block) => (
            <Button
              sx={{ background:'white', color:'black', border:'0.1px #578acc solid' }}
              key={block.type}
              variant="contained"
              startIcon={<span style={{marginBottom:'-10px'}}>{block.icon}</span>}
              onClick={() => {
                if (block.type === "email") {
                  handleAddEmailBlock();
                } else if (block.type === "twitter") {
                  handleAddTwitterBlock();
                } else if (block.type === "linkedin") {
                  handleAddLinkedinBlock();
                } else if (block.type === "facebook") {
                  handleAddFacebookBlock();
                } else if (block.type === "whatsapp") {
                  handleAddWhatsappBlock();
                } else if (block.type === "youtube") {
                  handleAddYoutubeBlock();
                } else {
                  addNode(block);
                }
              }}
            >
              {block.name}
            </Button>
          ))}
        </Box>

        <Box sx={{ marginLeft: "auto", display: "flex", gap: 2, marginTop:'50px' }}>
          <Button
            sx={{
              backgroundColor: "white",
              color: "green",
              border: "1px solid green",
              textTransform: "none",
            }}
            variant="contained"
            onClick={handleTestAutomation}
          >
            {t("automationFlow.testAutomation")}
          </Button>
          <Button
            sx={{
              backgroundColor: "green",
              color: "white",
              textTransform: "none",
            }}
            variant="contained"
            onClick={handleSaveAutomation}
          >
            {t("automationFlow.saveAutomation")}
          </Button>
        </Box>
      </Box>
    </Box>


      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {editingNode && (
        <Dialog open={!!openEditDialog} onClose={() => setOpenEditDialog("")}>
      {editingNode.data.blockType === "twitter" && (
        <TwitterNodeEditor
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}
      {editingNode.data.blockType === "youtube" && (
        <YouTubeNodeEditor
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}
      {editingNode.data.blockType === "facebook" && (
        <FacebookNodeEditor
        editingNode={editingNode}
        setEditingNode={setEditingNode}
        facebookPages={facebookPages}
        isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}


          {editingNode.data.blockType === "linkedin" && (
            <Box>
              <TextField
                sx={{
                  padding: "10px",
                  width: "550px",
                  marginTop: "15px",
                  marginRight: "15px",
                  marginLeft: "15px",
                  cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
                }}
                label={t("automationFlow.linkedinPostContent")}
                fullWidth
                multiline
                rows={4}
                inputProps={{ maxLength: 1300 }} // Limite de caracteres para post no LinkedIn
                value={editingNode.data.params.linkedinContent || ""}
                disabled={isConnectedToChatGPT()}
                onChange={(e) => {
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        linkedinContent: e.target.value,
                      },
                    },
                  });
                }}
              />
            </Box>
          )}
          {editingNode && editingNode.data.blockType === "chatgpt" && (
            <Dialog
              open={!!openEditDialog}
              onClose={() => setOpenEditDialog("")}
              fullWidth
            >
              <DialogTitle>{t("automationFlow.configureAI")}</DialogTitle>
              <DialogContent>
                {/* Escolher a Ação */}
                <TextField
                  select
                  label={t("automationFlow.aiActionLabel")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.action || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          action: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="generateContent">
                    {t("automationFlow.aiActionGenerateContent")}
                  </MenuItem>
                </TextField>

                {/* Escolher a Plataforma */}
                <TextField
                  select
                  label={t("automationFlow.platform")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.platform || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          platform: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="whatsapp">
                    {t("platform.whatsapp")}
                  </MenuItem>
                  <MenuItem value="twitter">
                    {t("platform.twitter")}
                  </MenuItem>
                  <MenuItem value="instagram">
                    {t("platform.instagram")}
                  </MenuItem>
                  <MenuItem value="email">{t("platform.email")}</MenuItem>
                </TextField>

                {/* Escolher o Tom de Voz */}
                <TextField
                  select
                  label={t("automationFlow.tone")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.tone || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          tone: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="formal">{t("tone.formal")}</MenuItem>
                  <MenuItem value="casual">{t("tone.casual")}</MenuItem>
                  <MenuItem value="divertido">{t("tone.fun")}</MenuItem>
                </TextField>

                {/* Instruções */}
                <TextField
                  label={t("automationFlow.instructions")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.instructions || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          instructions: e.target.value,
                        },
                      },
                    })
                  }
                />

                {/* Testar IA */}
                <Button
                  sx={{ marginTop: "15px" }}
                  variant="outlined"
                  onClick={async () => {
                    setIsLoadingAi(true);
                    try {
                      const prompt = `
                        Gere um conteúdo para a plataforma: ${
                          editingNode.data.params.platform || "indefinida"
                        }.
                        Ação: ${
                          editingNode.data.params.action ||
                          t("automationFlow.aiActionGenerateContent")
                        }.
                        Tom de voz: ${editingNode.data.params.tone || "Padrão"}.
                        Instruções do usuário: ${
                          editingNode.data.params.instructions ||
                          "Nenhuma instrução específica"
                        }.
                      `;

                      const response = await AiService.askQuickQuestion(
                        activeCompany,
                        prompt
                      );

                      if (response.data && response.data.answer) {
                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: {
                              ...editingNode.data.params,
                              aiResponse: response.data.answer,
                            },
                          },
                        });
                      }
                    } catch (error) {
                      console.error("Erro ao obter resposta da IA:", error);
                    } finally {
                      setIsLoadingAi(false);
                    }
                  }}
                  disabled={isLoadingAi}
                >
                  {isLoadingAi
                    ? t("automationFlow.generating")
                    : t("automationFlow.testAI")}
                </Button>

                {/* Skeleton enquanto a resposta carrega */}
                {isLoadingAi && (
                  <Box sx={{ marginTop: "15px" }}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="95%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                )}

                {/* Exibir Resposta da IA */}
                {!isLoadingAi && editingNode.data.params.aiResponse && (
                  <Box
                    sx={{
                      marginTop: "15px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {t("automationFlow.aiResponse")}
                    </Typography>
                    <Typography variant="body2">
                      {editingNode.data.params.aiResponse}
                    </Typography>
                  </Box>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenEditDialog("")}>
                  {t("form.cancel")}
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="contained"
                  disabled={!editingNode.data.params.aiResponse}
                >
                  {t("form.save")}
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <DialogContent>
            {editingNode.data.blockType === "email" && (
              <>
                <TextField
                  sx={{ marginTop: "10px" }}
                  label={t("automationFlow.emailName")}
                  fullWidth
                  value={editingNode.data.params.name}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                />
                <TextField
                  sx={{ marginTop: "10px" }}
                  label={t("automationFlow.recipients")}
                  fullWidth
                  value={editingNode.data.params.recipients}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          recipients: e.target.value,
                        },
                      },
                    })
                  }
                />
                <TextField
                  sx={{
                    marginTop: "10px",
                    cursor: isConnectedToChatGPT(editingNode.id)
                      ? "not-allowed"
                      : "text",
                  }}
                  label={t("automationFlow.subject")}
                  fullWidth
                  value={editingNode.data.params.subject || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          subject: e.target.value,
                        },
                      },
                    })
                  }
                  disabled={isConnectedToChatGPT(editingNode.id)}
                />
                {isConnectedToChatGPT(editingNode.id) && (
                  <Typography
                    sx={{
                      color: "#FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px",
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                    {t("automationFlow.subjectBlockedByAI")}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" mb={1}>
                    {t("automationFlow.selectedTemplate")}
                  </Typography>
                  {editingNode.data.params.template &&
                  editingNode.data.params.template.id ? (
                    <Box sx={{ border: "1px solid #ddd", p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        ID: {editingNode.data.params.template.id}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {t("automationFlow.noTemplateSelected")}
                    </Typography>
                  )}
                  <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => setOpenTemplateSelector(true)}
                  >
                    {t("automationFlow.chooseTemplate")}
                  </Button>
                </Box>
              </>
            )}
            {editingNode.data.blockType === "wait" && (
              <TextField
                sx={{ marginTop: "10px" }}
                label={t("automationFlow.repeatInterval")}
                type="number"
                fullWidth
                value={editingNode.data.params.waitHours}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        waitHours: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
            {editingNode.data.blockType === "whatsapp" && (
              <TextField
                sx={{ marginTop: "10px" }}
                label="Mensagem"
                type="text"
                fullWidth
                value={editingNode.data.params.message}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        message: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog("")}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("form.save")}</Button>
          </DialogActions>
        </Dialog>
      )}

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

      <EmailConfigurationModal
        open={openEmailConfigModal}
        onClose={() => setOpenEmailConfigModal(false)}
        onSave={handleSaveEmailConfig}
        activeCompany={activeCompany}
      />

      {/* Modal para seleção de templates */}
      <EmailTemplateSelector
        templates={emailTemplates}
        open={openTemplateSelector}
        onClose={() => setOpenTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        isConnectedToChatGpt={isConnectedToChatGPT(editingNode?.id)}
      />
    </Box>
  );
};

export default AutomationFlow;
