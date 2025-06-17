import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Chip,
  Paper,
  Divider,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Badge,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const mockLeads = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '11 99999-9999', stage: 'Novo', company: 'Empresa X', region: 'São Paulo', value: 1200 },
  { id: '2', name: 'Maria Lima', email: 'maria@email.com', phone: '21 88888-8888', stage: 'Qualificado', company: 'Empresa Y', region: 'Rio de Janeiro', value: 3000 },
  { id: '3', name: 'Carlos Sousa', email: 'carlos@email.com', phone: '31 77777-7777', stage: 'Proposta', company: 'Empresa Z', region: 'Minas Gerais', value: 5000 },
];

const stages = ['Novo', 'Qualificado', 'Proposta', 'Fechado'];

export default function CRMDashboard() {
  const [leads, setLeads] = useState(mockLeads);
  const { t } = useTranslation();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const updatedLeads = leads.map((lead) =>
      lead.id === draggableId ? { ...lead, stage: stages[destination.droppableId] } : lead
    );
    setLeads(updatedLeads);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t('marketing.crmTitle')}
      </Typography>

      <Grid container spacing={4}>
        {/* Segmentação e Filtros */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">{t('crmPipeline.filters')}</Typography>
            <TextField fullWidth label={t('crmPipeline.searchByName')} margin="normal" />
            <TextField fullWidth label={t('crmPipeline.region')} margin="normal" />
            <TextField fullWidth label={t('crmPipeline.minimumTicket')} margin="normal" type="number" />
            <Button fullWidth variant="contained" sx={{ mt: 2 }}>
              {t('crmPipeline.filter')}
            </Button>
          </Paper>
        </Grid>

        {/* Pipeline (Funil) */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" gutterBottom>
            {t('crmPipeline.salesPipeline')}
          </Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2}>
              {stages.map((stage, index) => (
                <Grid item xs={12} sm={6} md={3} key={stage}>
                  <Paper elevation={2} sx={{ p: 1, minHeight: 400 }}>
                    <Typography variant="subtitle1" align="center" gutterBottom>
                      {stage}
                    </Typography>
                    <Droppable droppableId={String(index)}>
                      {(provided) => (
                        <List
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{ minHeight: 300 }}
                        >
                          {leads.filter(l => l.stage === stage).map((lead, i) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={i}>
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ mb: 1, border: '1px solid #ccc', borderRadius: 2 }}
                                >
                                  <ListItemText
                                    primary={lead.name}
                                    secondary={`${lead.company} • ${lead.email}`}
                                  />
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DragDropContext>
        </Grid>

        {/* Relatórios Simples */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">{t('crmPipeline.salesSummary')}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">{t('crmPipeline.conversionRate')}:</Typography>
                <Typography variant="h6">25%</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">{t('crmPipeline.totalInFunnel')}:</Typography>
                <Typography variant="h6">R$ 9.200</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">{t('crmPipeline.averageTimeInFunnel')}:</Typography>
                <Typography variant="h6">5 dias</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
