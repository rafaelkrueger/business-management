import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Badge,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  MoreVert,
  Person,
  Business,
  AttachMoney,
  DateRange,
  Notes,
  Close,
  Check,
  FilterList,
  Search,
  ViewColumn,
  Settings
} from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import FunnelService from '../../../services/funnel.service.ts';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  company: string;
  stageId: string;
  value: number;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  probability?: number;
  tags?: string[];
}

interface Stage {
  id: string;
  name: string;
  color?: string;
  order: number;
}

interface SalesFunnelProps {
  activeCompany: string;
}

const SalesFunnelKanban: React.FC<SalesFunnelProps> = ({ activeCompany }) => {
  const { t } = useTranslation();
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newStageModalOpen, setNewStageModalOpen] = useState(false);
  const [editStageModalOpen, setEditStageModalOpen] = useState(false);
  const [currentStageEdit, setCurrentStageEdit] = useState<Stage | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    company: '',
    value: 0,
    stageId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [newStage, setNewStage] = useState<Partial<Stage>>({
    name: '',
    color: '#1976d2',
    order: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuStage, setContextMenuStage] = useState<Stage | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('');

  // Load data from API
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await FunnelService.list(activeCompany);
        if (data && data.length > 0) {
          setCurrentFunnelId(data[0].id);
          const detailRes = await FunnelService.detail(data[0].id);
          const detail = detailRes.data || {};
          const st: Stage[] = (detail.stages || []).map((s: any) => ({
            id: s.stage.id,
            name: s.stage.name,
            color: '#1976d2',
            order: s.stage.position
          }));
          const ld: Lead[] = [];
          (detail.stages || []).forEach((s: any) => {
            (s.leads || []).forEach((l: any) => {
              ld.push({
                id: l.id,
                name: l.leadId,
                company: '',
                stageId: l.stageId,
                value: 0,
                createdAt: new Date(l.createdAt),
                updatedAt: new Date(l.updatedAt)
              });
            });
          });
          setStages(st);
          setLeads(ld);
          const tags = Array.from(new Set(ld.flatMap(lead => lead.tags || [])));
          setAvailableTags(tags);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [activeCompany]);

  // Handlers
  const handleDrop = async (leadId: string, targetStage: string) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, stageId: targetStage, updatedAt: new Date() }
          : lead
      )
    );
    try {
      await FunnelService.moveLead(leadId, targetStage);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.company || !newLead.stageId) return;

    const lead: Lead = {
      id: uuidv4(),
      name: newLead.name,
      company: newLead.company,
      stageId: newLead.stageId!,
      value: newLead.value || 0,
      email: newLead.email,
      phone: newLead.phone,
      notes: newLead.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      probability: newLead.probability,
      tags: newLead.tags
    };

    setLeads([...leads, lead]);
    try {
      await FunnelService.addLead(lead.stageId, lead.id);
    } catch (e) {
      console.error(e);
    }
    setNewLead({
      name: '',
      company: '',
      value: 0,
      stageId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setNewLeadModalOpen(false);

    // Update available tags if new ones were added
    if (lead.tags) {
      const newTags = lead.tags.filter(tag => !availableTags.includes(tag));
      if (newTags.length > 0) {
        setAvailableTags([...availableTags, ...newTags]);
      }
    }
  };

  const handleAddStage = async () => {
    if (!newStage.name) return;

    const stage: Stage = {
      id: uuidv4(),
      name: newStage.name!,
      color: newStage.color || '#1976d2',
      order: stages.length
    };

    setStages([...stages, stage]);
    try {
      await FunnelService.createStage(currentFunnelId, { name: stage.name, position: stage.order });
    } catch (e) {
      console.error(e);
    }
    setNewStage({
      name: '',
      color: '#1976d2',
      order: 0
    });
    setNewStageModalOpen(false);
  };

  const handleUpdateStage = async () => {
    if (!currentStageEdit) return;

    setStages(stages.map(stage =>
      stage.id === currentStageEdit.id ? currentStageEdit : stage
    ));
    try {
      await FunnelService.updateStage(currentStageEdit.id, {
        name: currentStageEdit.name,
        position: currentStageEdit.order,
      });
    } catch (e) {
      console.error(e);
    }
    setEditStageModalOpen(false);
    setCurrentStageEdit(null);
  };

  const handleDeleteStage = (stageId: string) => {
    // Move all leads from this stage to the first available stage
    const newStageId = stages.find(s => s.id !== stageId)?.id;
    if (newStageId) {
      setLeads(leads.map(lead =>
        lead.stageId === stageId ? { ...lead, stageId: newStageId } : lead
      ));
    }

    setStages(stages.filter(stage => stage.id !== stageId));
    setEditStageModalOpen(false);
    setCurrentStageEdit(null);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>, stage: Stage) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextMenuStage(stage);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
    setContextMenuStage(null);
  };

  const handleEditStage = () => {
    if (!contextMenuStage) return;
    setCurrentStageEdit(contextMenuStage);
    setEditStageModalOpen(true);
    handleCloseContextMenu();
  };

  const handleStageColorChange = (color: string) => {
    if (!currentStageEdit) return;
    setCurrentStageEdit({ ...currentStageEdit, color });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);

    const matchesTags =
      filterTags.length === 0 ||
      (lead.tags && filterTags.every(tag => lead.tags!.includes(tag)));

    return matchesSearch && matchesTags;
  });

  const calculateStageValue = (stageId: string) => {
    return filteredLeads
      .filter(lead => lead.stageId === stageId)
      .reduce((sum, lead) => sum + lead.value, 0);
  };

  const calculateTotalValue = () => {
    return filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  };

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('salesFunnel.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder={t('salesFunnel.searchPlaceholder')}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tooltip title="Filter by tags">
            <Select
              multiple
              size="small"
              value={filterTags}
              onChange={(e) => setFilterTags(e.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <FilterList />
                  {selected.length > 0 && <Chip label={selected.length} size="small" />}
                </Box>
              )}
              sx={{ width: 120 }}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setNewLeadModalOpen(true)}
          >
            {t('salesFunnel.addLead')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setNewStageModalOpen(true)}
          >
            {t('salesFunnel.addStage')}
          </Button>
          <Tooltip title={t('salesFunnel.settings')}>
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Kanban board */}
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2 }}>
          {sortedStages.map((stage) => (
            <Box
              key={stage.id}
              onContextMenu={(e) => handleContextMenu(e, stage)}
              sx={{ minWidth: 300 }}
            >
              <StageColumn
                stage={stage}
                leads={filteredLeads.filter((lead) => lead.stageId === stage.id)}
                onDrop={handleDrop}
                onAddLead={() => {
                  setNewLead({ ...newLead, stageId: stage.id });
                  setNewLeadModalOpen(true);
                }}
                onDeleteLead={handleDeleteLead}
              />
            </Box>
          ))}
        </Box>
      </DndProvider>

      {/* Context menu for stages */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        <MenuItem onClick={handleEditStage}>
          <Edit sx={{ mr: 1 }} /> {t('salesFunnel.editStage')}
        </MenuItem>
        <MenuItem onClick={() => {
          if (!contextMenuStage) return;
          setCurrentStageEdit(contextMenuStage);
          handleCloseContextMenu();
          handleDeleteStage(contextMenuStage.id);
        }}>
          <Delete sx={{ mr: 1 }} /> {t('salesFunnel.deleteStage')}
        </MenuItem>
      </Menu>

      {/* Add Lead Modal */}
      <Dialog open={newLeadModalOpen} onClose={() => setNewLeadModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('salesFunnel.newLead')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('salesFunnel.name')}
              fullWidth
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
            <TextField
              label={t('salesFunnel.company')}
              fullWidth
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>{t('salesFunnel.stage')}</InputLabel>
              <Select
                value={newLead.stageId}
                label={t('salesFunnel.stage')}
                onChange={(e) => setNewLead({ ...newLead, stageId: e.target.value as string })}
              >
                {stages.map(stage => (
                  <MenuItem key={stage.id} value={stage.id}>{stage.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('salesFunnel.value')}
              type="number"
              fullWidth
              InputProps={{
                startAdornment: <AttachMoney sx={{ mr: 1 }} />
              }}
              value={newLead.value}
              onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
            />
            <TextField
              label="Email"
              fullWidth
              value={newLead.email || ''}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={newLead.phone || ''}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            />
            <TextField
              label="Probability (%)"
              type="number"
              fullWidth
              value={newLead.probability || 0}
              onChange={(e) => setNewLead({ ...newLead, probability: Number(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={newLead.tags?.join(', ') || ''}
              onChange={(e) => setNewLead({
                ...newLead,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={newLead.notes || ''}
              onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLeadModalOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button onClick={handleAddLead} variant="contained">{t('salesFunnel.addLead')}</Button>
        </DialogActions>
      </Dialog>

      {/* Add Stage Modal */}
      <Dialog open={newStageModalOpen} onClose={() => setNewStageModalOpen(false)}>
        <DialogTitle>{t('salesFunnel.newStage')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('salesFunnel.name')}
              fullWidth
              value={newStage.name}
              onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
            />
            <TextField
              label={t('salesFunnel.color')}
              type="color"
              fullWidth
              value={newStage.color}
              onChange={(e) => setNewStage({ ...newStage, color: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStageModalOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button onClick={handleAddStage} variant="contained">{t('salesFunnel.addStage')}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Stage Modal */}
      <Dialog open={editStageModalOpen} onClose={() => setEditStageModalOpen(false)}>
        <DialogTitle>{t('salesFunnel.editStage')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('salesFunnel.name')}
              fullWidth
              value={currentStageEdit?.name || ''}
              onChange={(e) => currentStageEdit && setCurrentStageEdit({ ...currentStageEdit, name: e.target.value })}
            />
            <TextField
              label={t('salesFunnel.color')}
              type="color"
              fullWidth
              value={currentStageEdit?.color || '#1976d2'}
              onChange={(e) => currentStageEdit && setCurrentStageEdit({ ...currentStageEdit, color: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => currentStageEdit && handleDeleteStage(currentStageEdit.id)}
            color="error"
          >
            {t('salesFunnel.delete')}
          </Button>
          <Button onClick={() => setEditStageModalOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button onClick={handleUpdateStage} variant="contained">{t('salesFunnel.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{t('salesFunnel.settings')}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>{t('salesFunnel.reorderStages')}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sortedStages.map(stage => (
              <Paper key={stage.id} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton sx={{ cursor: 'grab' }}>
                  <ViewColumn />
                </IconButton>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography>{stage.name}</Typography>
                </Box>
                <Box sx={{ width: 20, height: 20, backgroundColor: stage.color, borderRadius: '50%' }} />
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

interface StageColumnProps {
  stage: Stage;
  leads: Lead[];
  onDrop: (leadId: string, targetStage: string) => void;
  onAddLead: () => void;
  onDeleteLead: (leadId: string) => void;
}

const StageColumn: React.FC<StageColumnProps> = ({ stage, leads, onDrop, onAddLead, onDeleteLead }) => {
  const [, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: (item: { id: string }) => onDrop(item.id, stage.id),
  }), [stage]);

  return (
    <Box ref={drop} sx={{
      width: '100%',
      minHeight: 500,
      bgcolor: '#f9f9f9',
      p: 2,
      borderRadius: 2,
      borderTop: `4px solid ${stage.color}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{stage.name}</Typography>
        <Badge badgeContent={leads.length} color="primary" />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {leads.length === 0 ? (
          <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            {t('salesFunnel.noLeads')}
          </Paper>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onDrop={onDrop}
              onDelete={() => onDeleteLead(lead.id)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

interface LeadCardProps {
  lead: Lead;
  onDrop: (leadId: string, targetStage: string) => void;
  onDelete: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onDrop, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { id: lead.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [lead]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper
      ref={drag}
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        position: 'relative'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 1
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => {
          onDelete();
          handleClose();
        }}>
          <Delete sx={{ mr: 1 }} /> {t('salesFunnel.delete')}
        </MenuItem>
      </Menu>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1 }}>
          <Person fontSize="small" />
        </Avatar>
        <Typography fontWeight={600}>{lead.name}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">{lead.company}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="body2">
          R$ {lead.value.toLocaleString()}
        </Typography>
      </Box>

      {lead.probability && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption">Probability: {lead.probability}%</Typography>
          <Box sx={{ width: '100%', height: 4, bgcolor: 'divider', borderRadius: 2, mt: 0.5 }}>
            <Box sx={{
              width: `${lead.probability}%`,
              height: '100%',
              bgcolor: 'primary.main',
              borderRadius: 2
            }} />
          </Box>
        </Box>
      )}

      {expanded && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {lead.email && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Email:</strong> {lead.email}
            </Typography>
          )}
          {lead.phone && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Phone:</strong> {lead.phone}
            </Typography>
          )}
          {lead.tags && lead.tags.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                <strong>Tags:</strong>
              </Typography>
              {lead.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          )}
          {lead.notes && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Notes:</strong> {lead.notes}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Created: {format(new Date(lead.createdAt), 'MMM d, yyyy')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {format(new Date(lead.updatedAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SalesFunnelKanban;