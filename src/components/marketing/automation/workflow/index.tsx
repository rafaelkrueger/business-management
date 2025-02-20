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
import { AiOutlineMail, AiOutlineClockCircle, AiOutlineTwitter, AiOutlineRobot, AiOutlineWhatsApp, AiOutlineForm } from "react-icons/ai";
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


const BLOCK_TYPES = {
  EMAIL: {
    type: "email",
    name: "E-mail",
    icon: <AiOutlineMail size={20} />,
    params: { recipients: "", subject: "", template: {} },
  },
  // FORMS: {
  //   type: "forms",
  //   name: "forms",
  //   icon: <AiOutlineForm size={20} />,
  //   params: { recipients: "", subject: "", template: {} },
  // },
  WAIT: {
    type: "wait",
    name: "Aguardar...",
    icon: <AiOutlineClockCircle size={20} />,
    params: { waitTime: 1, waitHours: 0 },
  },
  // TWITTER: {
  //   type: "twitter",
  //   name: "Twitter",
  //   icon: <AiOutlineTwitter size={20} color="#1DA1F2" />,
  //   params: { tweetContent: "" },
  // },
  CHATGPT: {
    type: "chatgpt",
    name: "CHAT GPT",
    icon: <Brain size={20} color="#fff" />,
    params: {
      action: "generateContent",
      platform: "chat_gpt",
      tone: "neutral",
      keywords: "",
    },
  },
  // WHATSAPP: {
  //   type: "whatsapp",
  //   name: "Whatsapp",
  //   icon: <AiOutlineWhatsApp size={20} color="#ffffff" />,
  //   params: { message: "" },
  // },
};

const CustomNode = ({ data, id }) => {
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
          ✍️ {data.params.tweetContent || "Tweet não definido"}
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

const AutomationFlow = ({ activeCompany, setIsCreating, editingAutomation }) => {
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
  const [hasTwitterCredentials, setHasTwitterCredentials] = useState(false);
  const [loadingTwitterCheck, setLoadingTwitterCheck] = useState(true);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [openEmailConfigModal, setOpenEmailConfigModal] = useState(false);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);

  useEffect(() => {
    const checkTwitterCredentials = async () => {
      setLoadingTwitterCheck(true);
      try {
        const response = await TwitterService.get(activeCompany);
        console.log("Twitter Credentials Response:", response.data); // Debugging output
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



  // const handleAddTwitterBlock = async () => {
  //   if (loadingTwitterCheck) return; // Prevent action if still checking

  //   try {
  //     const response = await TwitterService.get(activeCompany);
  //     console.log("Adding Twitter Block - API Response:", response.data); // Debugging output

  //     if (response.data && response.data.accessToken) {
  //       setHasTwitterCredentials(true);
  //       addNode(BLOCK_TYPES.TWITTER);
  //     } else {
  //       setOpenTwitterAuthModal(true);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao verificar credenciais do Twitter:", error);
  //     setOpenTwitterAuthModal(true);
  //   }
  // };


  const handleSaveTwitterCredentials = async (config) => {
    try {
      await TwitterService.create(config);
      setOpenTwitterAuthModal(false);
      addNode(BLOCK_TYPES.TWITTER);
    } catch (error) {
      console.error("Erro ao salvar credenciais do Twitter:", error);
    }
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
      nodes,
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
          status:'PENDING'
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

  const isEmailConnectedToChatGPT = (emailNodeId) => {
    return edges.some(edge => {
      return edge.target === emailNodeId && nodes.find(node => node.id === edge.source && node.data.blockType === "chatgpt");
    });
  };



  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Box sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          ⚡ Criador de Automação
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          <TextField
            label="Nome do Fluxo"
            variant="outlined"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Data/Hora de Execução"
            variant="outlined"
            type="datetime-local"
            value={nextExecutionTime}
            onChange={(e) => setNextExecutionTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Intervalo de Repetição (horas)"
            variant="outlined"
            type="number"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              {Object.values(BLOCK_TYPES).map((block) => (
                <Button
                  key={block.type}
                  variant="contained"
                  onClick={() => {
                    if (block.type === "email") {
                      handleAddEmailBlock();
                    } else {
                      addNode(block);
                    }
                  }}
                >
                  <span style={{marginRight:'10px', marginBottom:'-5px'}}>{block.icon}</span>
                  {block.name}
                </Button>
              ))}
            </Box>

            {/* Aligns "Salvar Automação" to the right */}
            <Box sx={{ marginLeft: "auto" }}>
              <Button
                sx={{
                  color: "white",
                  background: "green",
                }}
                variant="contained"
                onClick={handleSaveAutomation}
              >
                Salvar Automação
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
            sx={{ marginTop: "10px" }}
            label="Conteúdo do Tweet"
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 280 }} // ✅ Enforces max length
            helperText={`${editingNode.data.params.tweetContent.length}/280`} // ✅ Shows character count
            value={editingNode.data.params.tweetContent || ""}
            onChange={(e) => {
              if (e.target.value.length <= 280) { // ✅ Prevents exceeding limit
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
            <Dialog open={!!openEditDialog} onClose={() => setOpenEditDialog("")} fullWidth>
              <DialogTitle>Configurar IA Inteligente</DialogTitle>
              <DialogContent>
                {/* Escolher a Ação */}
                <TextField
                  select
                  label="O que a IA deve fazer?"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.action || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: { ...editingNode.data.params, action: e.target.value },
                      },
                    })
                  }
                >
                  <MenuItem value="generateContent">Gerar Conteúdo</MenuItem>
                </TextField>

                {/* Escolher a Plataforma */}
                <TextField
                  select
                  label="Plataforma"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.platform || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: { ...editingNode.data.params, platform: e.target.value },
                      },
                    })
                  }
                >
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </TextField>

                {/* Escolher o Tom de Voz */}
                <TextField
                  select
                  label="Tom de Voz"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.tone || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: { ...editingNode.data.params, tone: e.target.value },
                      },
                    })
                  }
                >
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="divertido">Divertido</MenuItem>
                </TextField>

                {/* Instruções */}
                <TextField
                  label="Instruções"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.instructions || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: { ...editingNode.data.params, instructions: e.target.value },
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
                        Gere um conteúdo para a plataforma: ${editingNode.data.params.platform || "indefinida"}.
                        Ação: ${editingNode.data.params.action || "Gerar conteúdo"}.
                        Tom de voz: ${editingNode.data.params.tone || "Padrão"}.
                        Instruções do usuário: ${editingNode.data.params.instructions || "Nenhuma instrução específica"}.
                      `;

                      const response = await AiService.askQuickQuestion(activeCompany, prompt);

                      if (response.data && response.data.answer) {
                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: { ...editingNode.data.params, aiResponse: response.data.answer },
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
                  {isLoadingAi ? "Gerando..." : "Testar IA"}
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
                  <Box sx={{ marginTop: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <Typography variant="subtitle1">Resposta da IA:</Typography>
                    <Typography variant="body2">{editingNode.data.params.aiResponse}</Typography>
                  </Box>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenEditDialog("")}>Cancelar</Button>
                <Button onClick={handleSaveEdit} variant="contained" disabled={!editingNode.data.params.aiResponse}>
                  Salvar
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <DialogContent>
            {editingNode.data.blockType === "email" && (
              <>
                <TextField
                  sx={{ marginTop: "10px" }}
                  label="📧 Email Name"
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
                  label="Destinatários (separados por vírgula)"
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
                sx={{ marginTop: "10px", cursor: isEmailConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",}}
                label="Assunto"
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
                disabled={isEmailConnectedToChatGPT(editingNode.id)}
              />
                {isEmailConnectedToChatGPT(editingNode.id) && (
                  <Typography
                    sx={{
                      color: "#FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px",
                      textAlign:'center'
                    }}
                    variant="body2"
                  >
                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                    O compo está bloqueado porque este assunto será gerado pela IA.
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" mb={1}>
                    Template Selecionado:
                  </Typography>
                  {editingNode.data.params.template && editingNode.data.params.template.id ? (
                    <Box sx={{ border: "1px solid #ddd", p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        ID: {editingNode.data.params.template.id}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Nenhum template selecionado.
                    </Typography>
                  )}
                  <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => setOpenTemplateSelector(true)}
                  >
                    Escolher Template
                  </Button>
                </Box>

              </>
            )}
            {editingNode.data.blockType === "wait" && (
              <TextField
                sx={{ marginTop: "10px" }}
                label="Intervalo de Horas"
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
            <Button onClick={() => setOpenEditDialog("")}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
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
        isConnectedToChatGpt={isEmailConnectedToChatGPT(editingNode?.id)}
      />
    </Box>
  );
};

export default AutomationFlow;
