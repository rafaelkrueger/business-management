import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Switch,
  IconButton,
  useTheme,
  Chip,
  Skeleton,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
  Stack
} from "@mui/material";
import useHideOnScroll from "../../../../hooks/useHideOnScroll.ts";
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  ViewModule,
  ArrowBack,
  AutoAwesome,
  PlayCircleOutline,
  PauseCircleOutline,
  ArrowBackIos
} from "@mui/icons-material";
import AutomationFlow from "../workflow/index.tsx";
import AutomationService from "../../../../services/automation.service.ts";
import AutomationCalendar from "../automation-calendar/index.tsx";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { PlusOutlined } from "@ant-design/icons";

const AutomationDashboard = ({ activeCompany, setModule }) => {
  const [automations, setAutomations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const hideNav = useHideOnScroll();

  const fetchAutomations = useCallback(async () => {
    if (!activeCompany) return;

    setLoading(true);
    try {
      const response = await AutomationService.getAutomation(activeCompany);
      setAutomations(response.data);
    } catch (error) {
      console.error("Error fetching automations:", error);
      enqueueSnackbar(t("marketing.automation.fetchError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [activeCompany, enqueueSnackbar, t]);

  useEffect(() => {
    fetchAutomations();
  }, [activeCompany, fetchAutomations, isCreating]);

  const handleToggle = async (automation) => {
    const newStatus = automation.status === "PENDING" ? "DISABLED" : "PENDING";
    try {
      const updatedBody = {
        id: automation.id,
        name: automation.name,
        activeCompany,
        nodes: automation.nodes,
        edges: automation.edges,
        nextExecutionTime: automation.nextExecutionTime,
        status: newStatus,
      };
      const response = await AutomationService.editAutomation(updatedBody);
      const updatedAutomation = response.data;
      setAutomations((prev) =>
        prev.map((item) =>
          item.id === updatedAutomation.id ? updatedAutomation : item
        )
      );
      enqueueSnackbar(t("marketing.automation.statusUpdated"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      enqueueSnackbar(t("marketing.automation.statusUpdateError"), {
        variant: "error",
      });
    }
  };

  const handleDeleteAutomation = async (automationId) => {
    try {
      await AutomationService.deleteAutomation(automationId);
      setAutomations((prev) =>
        prev.filter((automation) => automation.id !== automationId)
      );
      enqueueSnackbar(t("marketing.automation.deleted"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting automation:", error);
      enqueueSnackbar(t("marketing.automation.deleteError"), {
        variant: "error",
      });
    }
  };

  const renderEmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        textAlign: "center",
        px: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%)",
        borderRadius: 3,
        mx: 2,
        my: 3
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 3,
            bgcolor: "primary.light",
            color: "primary.main"
          }}
        >
          <AutoAwesome fontSize="large" />
        </Avatar>
      </motion.div>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        {t("marketing.automationTable.emptyStateTitle")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: "300px" }}
      >
        {t("marketing.automationTable.emptyStateDescription")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreating(true)}
        size="large"
        startIcon={<Add />}
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
          }
        }}
      >
        {t("marketing.automationTable.createAutomation")}
      </Button>
    </Box>
  );

  const renderLoadingSkeleton = () => (
    <Grid container spacing={2} sx={{ px: 2, mt: 1 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={6} key={item}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 1.5, flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="rounded" width="100%" height={80} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const AutomationCard = ({ automation }) => (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <Card
        sx={{
          height: "100%",
          minHeight:'160px',
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
          }
        }}
      >
        <CardContent sx={{ pb: "16px !important" }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#578acd',
                  color: '#fff'
                }}
              >
                {automation.status === "PENDING" ? (
                  <PlayCircleOutline fontSize="small" />
                ) : (
                  <PauseCircleOutline fontSize="small" />
                )}
              </Avatar>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ ml: 1.5, flex: 1,  color: '#578acd' }}
                noWrap
              >
                {automation.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {automation.type !== "event" && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {format(
                    new Date(automation.nextExecutionTime),
                    "h:mm a"
                  )}
                </Typography>
              )}
            {automation.type === "event" && (
                <Typography variant="caption" color="text.secondary" noWrap>
                    Trigger
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 1
              }}
            >
              <Switch
                checked={automation.status === "PENDING"}
                onChange={() => handleToggle(automation)}
                color="primary"
                size="small"
              />
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => setEditingAutomation(automation)}
                  size="small"
                  sx={{ mr: 0.5 }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteAutomation(automation.id)}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderGrid = () => (
    <Grid container spacing={2} sx={{ px: 2, mt: 1 }}>
      <AnimatePresence>
        {automations.map((automation) => (
          <Grid item xs={6} key={automation.id}>
            <AutomationCard automation={automation} />
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );

  if (isCreating || editingAutomation) {
    return (
      <Box sx={{ p: 0 }}>
        <AutomationFlow
          activeCompany={activeCompany}
          editingAutomation={editingAutomation}
          setIsCreating={isCreating ? setIsCreating : undefined}
          onCreated={() => {
            fetchAutomations();
            setEditingAutomation(null);
          }}
          onUpdated={() => {
            fetchAutomations();
            setEditingAutomation(null);
          }}
          onCancel={() => {
            setIsCreating(false);
            setEditingAutomation(null);
          }}
          isEditing={Boolean(editingAutomation)}
          setIsCreating={setIsCreating}
          setEditingAutomation={setEditingAutomation}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2.9,
          pb: 1.5,
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
        <ArrowBackIos
          style={{
            cursor: 'pointer',
            marginRight: '16px',
            color: '#474747'
          }}
          onClick={() => setModule('')}
        />
        <Typography variant="h5" style={{
          color: '#333333',
          fontWeight: '600',
          flex: 1
        }}>
            {t("marketing.automation")}
          </Typography>
        </Box>
      <PlusOutlined
        style={{
          fontSize: '19px',
          color: 'white',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          marginRight: '5px',
          background:'#578acd',
          padding: '6px',
          borderRadius: '5px',
        }}
        onClick={() => setIsCreating(true)}
        />
      </Box>

      {loading ? (
        renderLoadingSkeleton()
      ) : viewMode === "grid" ? (
        automations.length > 0 ? (
          renderGrid()
        ) : (
          renderEmptyState()
        )
      ) : (
        <AutomationCalendar activeCompany={activeCompany} />
      )}

      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: `translateX(-50%) ${hideNav ? 'translateY(100%)' : 'translateY(0)'}`,
          width: "calc(100% - 32px)",
          maxWidth: 400,
          borderRadius: 3,
          zIndex: 1,
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "transform 0.3s"
        }}
      >
        <BottomNavigation
          value={viewMode}
          onChange={(event, newValue) => {
            setViewMode(newValue);
          }}
          showLabels
          sx={{
            bgcolor: "background.paper",
            "& .Mui-selected": {
              color: "primary.main"
            }
          }}
        >
          <BottomNavigationAction
            value="grid"
            label={t("marketing.automationTable.viewGrid")}
            icon={<ViewModule />}
          />
          <BottomNavigationAction
            value="calendar"
            label={t("marketing.automationTable.viewCalendar")}
            icon={<CalendarToday />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default React.memo(AutomationDashboard);