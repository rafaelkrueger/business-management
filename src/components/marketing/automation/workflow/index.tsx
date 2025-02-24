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
import TwitterAuthModal from "../../twitter-create/index.tsx";
import {
  AiOutlineMail,
  AiOutlineClockCircle,
  AiOutlineTwitter,
  AiOutlineRobot,
  AiOutlineWhatsApp,
  AiOutlineForm,
} from "react-icons/ai";
import TwitterService from "../../../../services/twitter.service.ts";
import AiService from "../../../../services/ai.service.ts";
import { Brain } from "lucide-react";

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
          ✍️ {data.params.tweetContent || t("automationFlow.noTweetDefined")}
        </Typography>
      )}

      <Box>
        <IconButton size="small" onClick={() => data.onEdit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => data.onDelete(id)}>
          <DeleteIcon />
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
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [hasTwitterCredentials, setHasTwitterCredentials] = useState(false);
  const [loadingTwitterCheck, setLoadingTwitterCheck] = useState(true);

  const [openEmailConfigModal, setOpenEmailConfigModal] = useState(false);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);

  // Definição dos blocos com traduções
  const BLOCK_TYPES = {
    EMAIL: {
      type: "email",
      name: t("block.email"),
      icon: <AiOutlineMail size={20} />,
      params: { recipients: "", subject: "", template: {} },
    },
    WAIT: {
      type: "wait",
      name: t("block.wait"),
      icon: <AiOutlineClockCircle size={20} />,
      params: { waitTime: 1, waitHours: 0 },
    },
    TWITTER: {
      type: "twitter",
      name: t("block.twitter"),
      icon: <AiOutlineTwitter size={20} color="#1DA1F2" />,
      params: { tweetContent: "" },
    },
    CHATGPT: {
      type: "chatgpt",
      name: t("block.chatgpt"),
      icon: <Brain size={20} color="#fff" />,
      params: {
        action: "generateContent",
        platform: "chat_gpt",
        tone: "neutral",
        keywords: "",
      },
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

  const handleAddTwitterBlock = async () => {
    try {
      const response = await TwitterService.checkTwitterStatus(activeCompany);
      console.log(response);
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
      <Box sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {t("automationFlow.title")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
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
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                maxWidth: "100%",
                overflowY: "auto",
              }}
            >
              {Object.values(BLOCK_TYPES).map((block) => (
                <Button
                  key={block.type}
                  variant="contained"
                  onClick={() => {
                    if (block.type === "email") {
                      handleAddEmailBlock();
                    } else if (block.type === "twitter") {
                      handleAddTwitterBlock();
                    } else {
                      addNode(block);
                    }
                  }}
                >
                  <span style={{ marginRight: "10px", marginBottom: "-5px" }}>
                    {block.icon}
                  </span>
                  {block.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ marginLeft: "auto" }}>
              <Button
                sx={{
                  background: "white",
                  color: "green",
                  border: "green 1px solid",
                }}
                variant="contained"
                onClick={handleTestAutomation}
              >
                {t("automationFlow.testAutomation")}
              </Button>
            </Box>
            <Box>
              <Button
                sx={{
                  color: "white",
                  background: "green",
                }}
                variant="contained"
                onClick={handleSaveAutomation}
              >
                {t("automationFlow.saveAutomation")}
              </Button>
            </Box>
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
            <TextField
              sx={{
                padding: "10px",
                width: "400px",
                marginTop: "15px",
                marginRight: "15px",
                marginLeft: "15px",
                cursor: isConnectedToChatGPT(editingNode.id)
                  ? "not-allowed"
                  : "text",
              }}
              label={t("automationFlow.noTweetDefined")}
              fullWidth
              multiline
              rows={3}
              inputProps={{ maxLength: 280 }}
              helperText={`${editingNode.data.params.tweetContent.length}/280`}
              value={editingNode.data.params.tweetContent || ""}
              disabled={isConnectedToChatGPT()}
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        tweetContent: e.target.value,
                      },
                    },
                  });
                }
              }}
            />
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
