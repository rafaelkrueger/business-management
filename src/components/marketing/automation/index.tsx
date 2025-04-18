import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Add, Edit, Delete, CalendarToday, ViewList, ArrowBackIos } from "@mui/icons-material";
import AutomationDragDrop from "./workflow/index.tsx";
import AutomationService from "../../../services/automation.service.ts";
import AutomationCalendar from "./automation-calendar/index.tsx";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from "../../products/styles.ts";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Skeleton from '@mui/material/Skeleton';

const AutomationDashboard = ({ activeCompany, setModule }) => {
  const [automations, setAutomations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const fetchAutomations = useCallback(async () => {
    if (!activeCompany) return;

    setLoading(true);
    try {
      const response = await AutomationService.getAutomation(activeCompany);
      setAutomations(response.data);
    } catch (error) {
      console.error("Erro ao buscar automações:", error);
      enqueueSnackbar(t("marketing.automation.fetchError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [activeCompany, enqueueSnackbar, t]);

  useEffect(() => {
    fetchAutomations();
  }, [activeCompany, fetchAutomations]);

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
      console.error("Erro ao atualizar status:", error);
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
      console.error("Erro ao deletar automação:", error);
      enqueueSnackbar(t("marketing.automation.deleteError"), {
        variant: "error",
      });
    }
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <AutoAwesomeIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'primary.main', mb: 1 }} />
      <EmptyStateTitle>
        {t('marketing.automationTable.emptyStateTitle')}
      </EmptyStateTitle>
      <EmptyStateDescription>
        {t('marketing.automationTable.emptyStateDescription')}
      </EmptyStateDescription>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreating(true)}
        size={isMobile ? "small" : "medium"}
        fullWidth={isMobile}
        sx={{ mt: 2 }}
      >
        {t('marketing.automationTable.createAutomation')}
      </Button>
    </EmptyStateContainer>
  );

  const renderLoadingSkeleton = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[1, 2, 3, 4, 5].map((item) => (
                <TableCell key={item}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              ))}
            </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <TableCell key={cell}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderTableRow = (automation) => (
    <TableRow key={automation.id}>
      <TableCell>{automation.name}</TableCell>
      <TableCell>
        <Switch
          checked={automation.status === "PENDING"}
          onChange={() => handleToggle(automation)}
          color="primary"
          size={isMobile ? "small" : "medium"}
        />
      </TableCell>
      <TableCell>
        {new Date(automation.nextExecutionTime).toLocaleString()}
      </TableCell>
      {!isMobile && (
        <TableCell>
          {new Date(automation.createdAt).toLocaleDateString()}
        </TableCell>
      )}
      <TableCell align="right">
        <IconButton
          color="primary"
          onClick={() => setEditingAutomation(automation)}
          size={isMobile ? "small" : "medium"}
        >
          <Edit fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDeleteAutomation(automation.id)}
          size={isMobile ? "small" : "medium"}
        >
          <Delete fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderTable = () => (
    <Card sx={{ mt: 3, overflowX: 'auto' }}>
      <CardContent>
        <TableContainer component={Paper} elevation={0}>
          <Table size={isMobile ? "small" : "medium"} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>{t("marketing.automationTable.name")}</b></TableCell>
                <TableCell><b>{t("marketing.automationTable.status")}</b></TableCell>
                <TableCell><b>{t("marketing.automationTable.nextExecution")}</b></TableCell>
                {!isMobile && (
                  <TableCell><b>{t("marketing.automationTable.createdAt")}</b></TableCell>
                )}
                <TableCell align="right"><b>{t("marketing.automationTable.actions")}</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {automations.map(renderTableRow)}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderViewToggle = () => (
    <ToggleButtonGroup
      color="primary"
      value={viewMode}
      exclusive
      onChange={(e, newMode) => newMode && setViewMode(newMode)}
      size={isMobile ? "small" : "medium"}
      orientation={isMobile ? "vertical" : "horizontal"}
      fullWidth={isMobile}
    >
      <ToggleButton value="table">
        <ViewList fontSize={isMobile ? "small" : "medium"} />
        {!isMobile && t("marketing.automationTable.viewTable")}
      </ToggleButton>
      <ToggleButton value="calendar">
        <CalendarToday fontSize={isMobile ? "small" : "medium"} />
        {!isMobile && t("marketing.automationTable.viewCalendar")}
      </ToggleButton>
    </ToggleButtonGroup>
  );

  const renderHeader = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={isMobile ? "column" : "row"} gap={2}>
      <Box display="flex" alignItems="center" width={isMobile ? "100%" : "auto"}>
        <IconButton onClick={() => setModule('')} size={isMobile ? "small" : "medium"}>
          <ArrowBackIos fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => setIsCreating(true)}
          size={isMobile ? "small" : "medium"}
          sx={{ ml: isMobile ? 1 : 3 }}
          fullWidth={isMobile}
        >
          {t("marketing.automationTable.newAutomation")}
        </Button>
      </Box>
      {renderViewToggle()}
    </Box>
  );

  if (isCreating || editingAutomation) {
    return (
      <Box sx={{ padding: isMobile ? 2 : 4 }}>
        <AutomationDragDrop
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
    <Box sx={{ padding: isMobile ? 2 : 4 }}>
      {renderHeader()}

      {loading ? (
        renderLoadingSkeleton()
      ) : viewMode === "table" ? (
        automations.length > 0 ? renderTable() : renderEmptyState()
      ) : (
        <AutomationCalendar activeCompany={activeCompany} />
      )}
    </Box>
  );
};

export default React.memo(AutomationDashboard);