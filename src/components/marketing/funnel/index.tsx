import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, Select, Card, CardContent } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import SalesFunnelService from '../../../services/sales-funnel.service.ts';
import CrmService from '../../../services/crm.service.ts';

interface FunnelBoardProps {
  activeCompany: string;
}

interface Stage {
  id: string;
  name: string;
}

interface LeadEntry {
  id: string;
  stageId: string;
  leadId: string;
}

const SalesFunnelKanban: React.FC<FunnelBoardProps> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [funnels, setFunnels] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [stages, setStages] = useState<Stage[]>([]);
  const [entries, setEntries] = useState<LeadEntry[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);

  useEffect(() => {
    if (!activeCompany) return;
    SalesFunnelService.list(activeCompany).then((res) => {
      const list = res.data || [];
      setFunnels(list);
      if (list.length) {
        setSelectedId(list[0].id);
      }
    });
    CrmService.getCrm(activeCompany).then((res) => setCrmLeads(res.data || []));
  }, [activeCompany]);

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  const fetchDetail = async (id: string) => {
    const res = await SalesFunnelService.detail(id);
    const stagesData = res.data?.stages || [];
    setStages(stagesData.map((s: any) => s.stage));
    const list: LeadEntry[] = stagesData.flatMap((s: any) =>
      s.leads.map((l: any) => ({ ...l, stageId: s.stage.id }))
    );
    setEntries(list);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const entryId = result.draggableId;
    const toStageId = result.destination.droppableId;
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, stageId: toStageId } : e)));
    try {
      await SalesFunnelService.moveLead(entryId, toStageId);
    } catch (e) {
      fetchDetail(selectedId);
    }
  };

  const getLeadName = (leadId: string) => {
    const l = crmLeads.find((c: any) => c.id === leadId);
    return l?.name || leadId;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h5">{t('marketing.funnel.title')}</Typography>
        <Select
          size="small"
          value={selectedId}
          displayEmpty
          onChange={(e) => setSelectedId(e.target.value as string)}
        >
          <MenuItem value="" disabled>
            {t('marketing.funnel.select')}
          </MenuItem>
          {funnels.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', overflowX: 'auto' }}>
          {stages.map((stage) => (
            <Droppable droppableId={stage.id} key={stage.id}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minWidth: 250 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {stage.name}
                  </Typography>
                  {entries
                    .filter((e) => e.stageId === stage.id)
                    .map((entry, index) => (
                      <Draggable draggableId={entry.id} index={index} key={entry.id}>
                        {(prov) => (
                          <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} sx={{ mb: 1 }}>
                            <CardContent>
                              <Typography>{getLeadName(entry.leadId)}</Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default SalesFunnelKanban;
