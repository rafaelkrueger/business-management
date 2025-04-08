import React, { useState, useEffect } from "react";
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
  ToggleButton
} from "@mui/material";
import { Add, Edit, Delete, CalendarToday, ViewList, ArrowBackIos } from "@mui/icons-material";
import AutomationDragDrop from "./workflow/index.tsx";
import AutomationService from "../../../services/automation.service.ts";
import AutomationCalendar from "./automation-calendar/index.tsx";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from "../../products/styles.ts";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AutomationDashboard = ({ activeCompany, setModule }) => {
  const [automations, setAutomations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const fetchAutomations = async () => {
    try {
      const response = await AutomationService.getAutomation(activeCompany);
      setAutomations(response.data);
    } catch (error) {
      console.error("Erro ao buscar automações:", error);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      fetchAutomations();
    }
  }, [activeCompany, isCreating]);

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
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
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
    }
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />

      <EmptyStateTitle>
        {t('marketing.automationTable.emptyStateTitle')}
      </EmptyStateTitle>

      <EmptyStateDescription>
        {t('marketing.automationTable.emptyStateDescription')}
      </EmptyStateDescription>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsCreating(true);
        }}
      >
        {t('marketing.automationTable.createAutomation')}
      </Button>
    </EmptyStateContainer>
  );

  const renderTable = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <TableContainer>
          <Table sx={{ border: "unset" }}>
            <TableHead>
              <TableRow>
                <TableCell><b>{t("marketing.automationTable.name")}</b></TableCell>
                <TableCell><b>{t("marketing.automationTable.status")}</b></TableCell>
                <TableCell><b>{t("marketing.automationTable.nextExecution")}</b></TableCell>
                <TableCell><b>{t("marketing.automationTable.createdAt")}</b></TableCell>
                <TableCell align="right"><b>{t("marketing.automationTable.actions")}</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {automations.map((automation) => (
                <TableRow key={automation.id}>
                  <TableCell>{automation.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={automation.status === "PENDING"}
                      onChange={() => handleToggle(automation)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(automation.nextExecutionTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(automation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => setEditingAutomation(automation)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAutomation(automation.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 4 }}>
      {isCreating || editingAutomation ? (
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
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
                <ArrowBackIos style={{cursor:'pointer'}} onClick={()=>{setModule('')}}/>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => setIsCreating(true)}
                  sx={{marginLeft:'30px', marginTop:'-15px'}}
                >
                  {t("marketing.automationTable.newAutomation")}
                </Button>
            </Box>
                <ToggleButtonGroup
                  color="primary"
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => {
                    if (newMode !== null) {
                      setViewMode(newMode);
                    }
                  }}
                  size="small"
                >
              <ToggleButton value="table">
                <ViewList /> {t("marketing.automationTable.viewTable")}
              </ToggleButton>
              <ToggleButton value="calendar">
                <CalendarToday /> {t("marketing.automationTable.viewCalendar")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {viewMode === "table" ? automations.length > 0 ? renderTable() : renderEmptyState() : <AutomationCalendar activeCompany={activeCompany} />}
        </>
      )}
    </Box>
  );
};

export default AutomationDashboard;
