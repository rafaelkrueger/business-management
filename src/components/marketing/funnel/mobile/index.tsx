import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  Plus, MoreVertical, Search,
  Trash2, FileEdit, GripVertical,
  User, Phone, Mail, Calendar, DollarSign, UserPlus, ChevronDown, ChevronUp
} from 'lucide-react';
import dayjs from 'dayjs';
import CrmService from '../../../../services/crm.service.ts';
import SegmentationService from '../../../../services/segmentation.service.ts';
import FunnelService from '../../../../services/funnel.service.ts';
import { ArrowBackIos } from '@mui/icons-material';
import { PlusOutlined } from '@ant-design/icons';
import LeadDetailsModal from '../lead-details-modal';

// ======================
// Estilos com Styled Components para Mobile
// ======================

const MobileContainer = styled.div`
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: #f8fafc;
  padding: 16px;
  min-height: 100vh;
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  background-color: #f8fafc;
  z-index: 10;
  padding: 8px 0;

  h1 {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    flex-grow: 1;
    text-align: center;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const SearchBoxMobile = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  width: 90%;

  input {
    border: none;
    margin-left: 8px;
    outline: none;
    font-size: 16px;
    width: 100%;
    color: #64748b;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const FilterButtonMobile = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SegmentSelectMobile = styled.select`
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #64748b;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
`;

const StagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StageAccordion = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: #ffffff;
  border-bottom: ${props => props.$isOpen ? '1px solid #e2e8f0' : 'none'};
`;

const StageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #334155;
    margin: 0;
  }
`;

const BadgeMobile = styled.span`
  background-color: #e2e8f0;
  color: #475569;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
`;

const StageContent = styled.div`
  padding: ${props => props.$isOpen ? '16px' : '0 16px'};
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const CardsContainerMobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KanbanCardMobileContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
`;

const CardHeaderMobile = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LeadDetailMobile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;

  svg {
    flex-shrink: 0;
  }
`;

const CardFooterMobile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const PriorityTagMobile = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;

  &.hot {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &.warm {
    background-color: #fef3c7;
    color: #d97706;
  }

  &.cold {
    background-color: #dbeafe;
    color: #2563eb;
  }
`;

const ValueTagMobile = styled.span`
  background-color: #dcfce7;
  color: #16a34a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const SourceTagMobile = styled.span`
  background-color: #ede9fe;
  color: #7c3aed;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

const MenuButtonMobile = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const DropdownContainerMobile = styled.div`
  position: relative;
`;

const DropdownMenuMobile = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 10;
  min-width: 160px;
`;

const DropdownItemMobile = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #475569;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const AddStageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background-color: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  padding: 16px;
  font-size: 14px;
  margin-top: 8px;
`;

const EmptyStateMobile = styled.div`
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 14px;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

// ======================
// Interfaces
// ======================

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: Date;
  value: number;
  source: string;
  jsonData: Record<string, any>;
}

interface FilterCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'startsWith';
  value: any;
}

interface Segment {
  id: string;
  name: string;
  conditions: FilterCondition[];
}

// ======================
// Componentes React para Mobile
// ======================

const KanbanCardMobile = ({ card, onMove, onClick }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <KanbanCardMobileContainer onClick={onClick}>
      <PriorityTagMobile className={card.priority}>{card.priority}</PriorityTagMobile>
      <CardHeaderMobile>
        <h4>{card.title}</h4>
        <DropdownContainerMobile>
          <MenuButtonMobile onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={20} />
          </MenuButtonMobile>
          {showMenu && (
            <DropdownMenuMobile>
              <DropdownItemMobile onClick={() => onMove(card.id)}>
                <GripVertical size={16} /> {t('salesFunnel.moveLead')}
              </DropdownItemMobile>
            </DropdownMenuMobile>
          )}
        </DropdownContainerMobile>
      </CardHeaderMobile>

      <CardContent>
        <LeadDetailMobile>
          <Phone size={16} />
          <span>{card.phone}</span>
        </LeadDetailMobile>
        <LeadDetailMobile>
          <Mail size={16} />
          <span>{card.email}</span>
        </LeadDetailMobile>
        <LeadDetailMobile>
          <Calendar size={16} />
          <span>{card.lastContact}</span>
        </LeadDetailMobile>
      </CardContent>

      <CardFooterMobile>
        <div>
          <ValueTagMobile>
            <DollarSign size={14} />
            {card.value}
          </ValueTagMobile>
          <SourceTagMobile>{card.source}</SourceTagMobile>
        </div>
      </CardFooterMobile>
    </KanbanCardMobileContainer>
  );
};

const StageAccordionComponent = ({
  column,
  isOpen,
  toggleAccordion,
  onEditStage,
  onDeleteStage,
  onAddCard,
  onMoveLead,
  onViewLead
}) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <StageAccordion>
      <StageHeader
        onClick={toggleAccordion}
        $isOpen={isOpen}
      >
        <StageTitle>
          <h3>{column.title}</h3>
          <BadgeMobile>{column.cards.length}</BadgeMobile>
        </StageTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <DropdownContainerMobile>
            <MenuButtonMobile onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}>
              <MoreVertical size={20} />
            </MenuButtonMobile>
            {showMenu && (
              <DropdownMenuMobile>
                <DropdownItemMobile onClick={() => onEditStage(column.title)}>
                  <FileEdit size={16} /> {t('salesFunnel.editStage')}
                </DropdownItemMobile>
                <DropdownItemMobile onClick={() => onDeleteStage(column.title)}>
                  <Trash2 size={16} /> {t('salesFunnel.deleteStage')}
                </DropdownItemMobile>
              </DropdownMenuMobile>
            )}
          </DropdownContainerMobile>
        </div>
      </StageHeader>

      <StageContent $isOpen={isOpen}>
        <CardsContainerMobile>
        {column.cards.length > 0 ? (
        column.cards.map((card) => (
            <KanbanCardMobile
              key={card.id}
              card={card}
              onMove={() => onMoveLead(card.id)}
              onClick={() => onViewLead(card.id)}
            />
        ))
        ) : (
        <EmptyStateMobile onClick={onAddCard}>
            <Plus size={18} /> {t('salesFunnel.addFirstLead')}
        </EmptyStateMobile>
        )}
        </CardsContainerMobile>
      </StageContent>
    </StageAccordion>
  );
};

const SalesFunnelMobile: React.FC<{ activeCompany?: string, setModule: any }> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [columns, setColumns] = useState<any[]>([]);
  const [funnelModalOpen, setFunnelModalOpen] = useState(false);
  const [funnelName, setFunnelName] = useState('');
  const [funnelDescription, setFunnelDescription] = useState('');
  const [funnelSegment, setFunnelSegment] = useState('');
  const [funnels, setFunnels] = useState<any[]>([]);
  const [selectedFunnelId, setSelectedFunnelId] = useState<string>('');
  const [stages, setStages] = useState<string[]>([]);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [stageDialogMode, setStageDialogMode] = useState<'add' | 'edit'>('add');
  const [stageDialogName, setStageDialogName] = useState('');
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [deleteStage, setDeleteStage] = useState<string | null>(null);
  const [leadActivities, setLeadActivities] = useState<Record<string, string>>({});
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({});
  const [moveLeadModalOpen, setMoveLeadModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (!activeCompany) return;
    fetchInitialData();
  }, [activeCompany]);

  useEffect(() => {
    const funnel = funnels.find(f => String(f.id) === String(selectedFunnelId));
    if (funnel) {
      setStages(funnel.stages || []);
      // Inicializar estados abertos para cada estágio
      const initialOpenStates = (funnel.stages || []).reduce((acc, stage) => {
        acc[stage] = false;
        return acc;
      }, {});
      setOpenStages(initialOpenStates);
    } else {
      setStages([]);
      setOpenStages({});
    }
  }, [selectedFunnelId, funnels]);

  useEffect(() => {
    if (!selectedFunnelId) return;
    const fetchActivities = async () => {
      try {
        const res = await FunnelService.getLeadActivity(selectedFunnelId);
        const map: Record<string, string> = {};
        (res.data || []).forEach((item: any) => {
          map[item.leadId] = item.toStageId;
        });
        setLeadActivities(map);
      } catch (err) {
        setLeadActivities({});
      }
    };
    fetchActivities();
  }, [selectedFunnelId]);

  const fetchInitialData = async () => {
    try {
      const [leadRes, segmentRes, funnelRes] = await Promise.all([
        CrmService.getCrm(activeCompany),
        SegmentationService.getSegments(activeCompany),
        FunnelService.list(activeCompany)
      ]);

      const mapped = leadRes.data?.map((lead: any) => {
        const parsedSource = typeof lead.source === 'string' ? JSON.parse(lead.source) : lead.source;
        return {
          id: lead.id,
          name: lead.jsonData?.nome || lead.jsonData?.name || '',
          email: lead.jsonData?.email || '',
          phone: lead.jsonData?.telefone || lead.jsonData?.phone || '',
          status: (lead.status || 'lead').toLowerCase(),
          lastContact: new Date(lead.updatedAt),
          value: lead.jsonData?.valor || lead.jsonData?.value || 0,
          source: parsedSource?.source || '',
          jsonData: lead.jsonData || {}
        } as Lead;
      }) || [];

      setLeads(mapped);
      setSegments(segmentRes.data || []);
      setFunnels(funnelRes.data || []);
      if ((funnelRes.data || []).length && !selectedFunnelId) {
        setSelectedFunnelId(String(funnelRes.data[0].id));
      }
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    }
  };

  useEffect(() => {
    updateColumns();
  }, [leads, selectedSegment, searchText, stages]);

  const filterLeads = () => {
    let result = [...leads];

    if (selectedSegment) {
      const segment = segments.find(s => String(s.id) === selectedSegment);
      if (segment) {
        const conditions = segment.conditions || [];
        result = result.filter(lead => {
          return conditions.every((condition: any) => {
            const field = condition.field;
            let value = (lead as any)[field];
            if (value === undefined && lead.jsonData) {
              value = lead.jsonData[field];
            }
            if (value === undefined || value === null) return false;
            const conditionValue = String(condition.value);
            const leadValueStr = String(value).toLowerCase();
            switch (condition.operator) {
              case 'eq':
                return leadValueStr === conditionValue.toLowerCase();
              case 'neq':
                return leadValueStr !== conditionValue.toLowerCase();
              case 'gt':
                return !isNaN(Number(value)) && !isNaN(Number(conditionValue)) && Number(value) > Number(conditionValue);
              case 'lt':
                return !isNaN(Number(value)) && !isNaN(Number(conditionValue)) && Number(value) < Number(conditionValue);
              case 'contains':
                return leadValueStr.includes(conditionValue.toLowerCase());
              case 'startsWith':
                return leadValueStr.startsWith(conditionValue.toLowerCase());
              default:
                return true;
            }
          });
        });
      }
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter((lead) => {
        return (
          (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
          (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
          (lead.status && lead.status.toLowerCase().includes(searchLower)) ||
          Object.values(lead.jsonData || {}).some(val => typeof val === 'string' && val.toLowerCase().includes(searchLower))
        );
      });
    }

    return result;
  };

  const updateColumns = () => {
    const filtered = filterLeads();
    const stageList = stages.length ? stages : ['Lead', 'Prospect', 'Customer', 'Churned'];

    const columnsMap = stageList.reduce((acc, status) => {
      acc[status.toLowerCase()] = [];
      return acc;
    }, {} as Record<string, any[]>);

    filtered.forEach(l => {
      const mappedStage = leadActivities[l.id];
      const stageIndex = mappedStage
        ? stageList.findIndex(s => s.toLowerCase() === mappedStage.toLowerCase())
        : -1;

      if (stageIndex !== -1) {
        columnsMap[stageList[stageIndex].toLowerCase()].push({
          id: l.id,
          title: l.name || 'Lead',
          email: l.email,
          phone: l.phone,
          lastContact: dayjs(l.lastContact).format('DD/MM/YYYY'),
          priority: 'hot',
          value: l.value,
          source: l.source
        });
      } else {
        columnsMap[stageList[0].toLowerCase()].push({
          id: l.id,
          title: l.name || 'Lead',
          email: l.email,
          phone: l.phone,
          lastContact: dayjs(l.lastContact).format('DD/MM/YYYY'),
          priority: 'hot',
          value: l.value,
          source: l.source
        });
      }
    });

    const newColumns = stageList.map(status => ({
      id: status,
      title: status,
      cards: columnsMap[status.toLowerCase()] || []
    }));

    setColumns(newColumns);
  };

  const toggleStage = (stageId: string) => {
    setOpenStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleMoveLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setMoveLeadModalOpen(true);
  };

  const handleViewLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) setViewLead(lead);
  };

  const confirmMoveLead = async () => {
    if (!selectedFunnelId || !selectedLeadId || !selectedStageId) {
      setMoveLeadModalOpen(false);
      return;
    }

    try {
      await FunnelService.moveLead(selectedFunnelId, selectedLeadId, selectedStageId);

      // Atualizar o estado local
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          // Remover o lead do estágio atual
          if (column.cards.some(card => card.id === selectedLeadId)) {
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== selectedLeadId)
            };
          }
          // Adicionar o lead no novo estágio
          if (column.id === selectedStageId) {
            const lead = leads.find(l => l.id === selectedLeadId);
            if (lead) {
              return {
                ...column,
                cards: [
                  ...column.cards,
                  {
                    id: lead.id,
                    title: lead.name || 'Lead',
                    email: lead.email,
                    phone: lead.phone,
                    lastContact: dayjs(lead.lastContact).format('DD/MM/YYYY'),
                    priority: 'hot',
                    value: lead.value,
                    source: lead.source
                  }
                ]
              };
            }
          }
          return column;
        });
      });

      enqueueSnackbar(t('salesFunnel.leadMoved'), { variant: 'success' });
    } catch (err) {
      console.error('Erro ao mover lead:', err);
      enqueueSnackbar(t('salesFunnel.errorMovingLead'), { variant: 'error' });
    }

    setMoveLeadModalOpen(false);
    setSelectedLeadId('');
    setSelectedStageId('');
  };

  const handleAddStage = () => {
    setStageDialogMode('add');
    setStageDialogName('');
    setEditingStage(null);
    setStageDialogOpen(true);
  };

  const handleEditStage = (stage: string) => {
    setStageDialogMode('edit');
    setStageDialogName(stage);
    setEditingStage(stage);
    setStageDialogOpen(true);
  };

  const handleDeleteStage = (stage: string) => {
    setDeleteStage(stage);
  };

  const saveStageDialog = async () => {
    if (!selectedFunnelId) return;
    const name = stageDialogName.trim();
    if (!name) return;

    if (stageDialogMode === 'add') {
      try {
        await FunnelService.createStage(selectedFunnelId, { name });
        setStages(prev => [...prev, name]);
        setOpenStages(prev => ({ ...prev, [name]: false }));
        enqueueSnackbar(t('salesFunnel.stageAdded'), { variant: 'success' });
      } catch (err) {
        console.error('Erro ao adicionar etapa:', err);
        enqueueSnackbar(t('salesFunnel.errorAddingStage'), { variant: 'error' });
      }
    } else if (editingStage) {
      const updated = stages.map(s => (s === editingStage ? name : s));
      try {
        await FunnelService.updateStages(selectedFunnelId, updated);
        setStages(updated);

        // Atualizar o estado aberto se necessário
        if (openStages[editingStage] !== undefined) {
          const newOpenStages = { ...openStages };
          newOpenStages[name] = newOpenStages[editingStage];
          delete newOpenStages[editingStage];
          setOpenStages(newOpenStages);
        }

        enqueueSnackbar(t('salesFunnel.stageUpdated'), { variant: 'success' });
      } catch (err) {
        console.error('Erro ao editar etapa:', err);
        enqueueSnackbar(t('salesFunnel.errorUpdatingStage'), { variant: 'error' });
      }
    }

    setStageDialogOpen(false);
    setStageDialogName('');
    setEditingStage(null);
  };

  const confirmDeleteStage = async () => {
    if (!selectedFunnelId || !deleteStage) {
      setDeleteStage(null);
      return;
    }

    const updated = stages.filter(s => s !== deleteStage);
    try {
      await FunnelService.updateStages(selectedFunnelId, updated);
      setStages(updated);

      // Remover do estado aberto
      if (openStages[deleteStage] !== undefined) {
        const newOpenStages = { ...openStages };
        delete newOpenStages[deleteStage];
        setOpenStages(newOpenStages);
      }

      enqueueSnackbar(t('salesFunnel.stageDeleted'), { variant: 'success' });
    } catch (err) {
      console.error('Erro ao remover etapa:', err);
      enqueueSnackbar(t('salesFunnel.errorDeletingStage'), { variant: 'error' });
    }

    setDeleteStage(null);
  };

  return (
    <MobileContainer>
      <MobileHeader>
        <ArrowBackIos
        style={{
            cursor: 'pointer',
            marginRight: '20px',
            color: '#474747'
        }}
        onClick={() => setModule('')}
        />
        <h1 style={{ textAlign:'left'}}>{t('salesFunnel.title')}</h1>
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
        onClick={() => setFunnelModalOpen(true)}
        />
      </MobileHeader>
      <ControlsContainer>
        <SearchBoxMobile>
          <Search size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder={t('salesFunnel.searchPlaceholder') || t('kanban.search')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </SearchBoxMobile>

        <FilterRow>
          <SegmentSelectMobile
            value={selectedFunnelId}
            onChange={(e) => setSelectedFunnelId(e.target.value)}
          >
            <option value="">{t('salesFunnel.selectFunnel')}</option>
            {funnels.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </SegmentSelectMobile>
        </FilterRow>
      </ControlsContainer>

      <StagesContainer>
        {columns.map((column) => (
          <StageAccordionComponent
            key={column.id}
            column={column}
            isOpen={!!openStages[column.id]}
            toggleAccordion={() => toggleStage(column.id)}
            onEditStage={handleEditStage}
            onDeleteStage={handleDeleteStage}
            onAddCard={() => {}}
            onMoveLead={handleMoveLead}
            onViewLead={handleViewLead}
          />
        ))}

        <AddStageButton onClick={handleAddStage}>
          <Plus size={18} /> {t('salesFunnel.addStage')}
        </AddStageButton>
      </StagesContainer>

      {/* Modal para criar novo funil */}
      <Dialog open={funnelModalOpen} onClose={() => setFunnelModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('salesFunnel.createFunnel')}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label={t('salesFunnel.funnelName')}
            value={funnelName}
            onChange={(e) => setFunnelName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={t('salesFunnel.funnelDescription')}
            value={funnelDescription}
            onChange={(e) => setFunnelDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('salesFunnel.segmentation')}</InputLabel>
            <Select
              value={funnelSegment}
              label={t('salesFunnel.segmentation')}
              onChange={(e) => setFunnelSegment(e.target.value as string)}
            >
              <MenuItem value="">
                {t('salesFunnel.selectSegmentation')}
              </MenuItem>
              {segments.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFunnelModalOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button variant="contained" onClick={async () => {
            try {
              await FunnelService.create({
                name: funnelName,
                description: funnelDescription,
                companyId: activeCompany,
                segmentationId: funnelSegment
              });
              enqueueSnackbar(t('salesFunnel.newFunnel'), { variant: 'success' });
              setFunnelModalOpen(false);
              setFunnelName('');
              setFunnelDescription('');
              setFunnelSegment('');
              fetchInitialData();
            } catch (err) {
              console.error('Erro ao criar funil', err);
              enqueueSnackbar(t('salesFunnel.errorCreatingFunnel'), { variant: 'error' });
            }
          }}>{t('salesFunnel.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para adicionar/editar estágio */}
      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {stageDialogMode === 'add' ? t('salesFunnel.newStage') : t('salesFunnel.editStage')}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label={t('salesFunnel.stageName')}
            value={stageDialogName}
            onChange={(e) => setStageDialogName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageDialogOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button variant="contained" onClick={saveStageDialog}>{t('salesFunnel.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar exclusão de estágio */}
      <Dialog open={!!deleteStage} onClose={() => setDeleteStage(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('salesFunnel.confirmDeleteStageTitle')}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t('salesFunnel.confirmDeleteStageMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStage(null)}>{t('salesFunnel.cancel')}</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteStage}>{t('salesFunnel.delete')}</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mover lead */}
      <Dialog open={moveLeadModalOpen} onClose={() => setMoveLeadModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('salesFunnel.moveLead')}</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('salesFunnel.selectStage')}</InputLabel>
            <Select
              value={selectedStageId}
              label={t('salesFunnel.selectStage')}
              onChange={(e) => setSelectedStageId(e.target.value as string)}
            >
              {columns.map((stage) => (
                <MenuItem key={stage.id} value={stage.id}>{stage.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveLeadModalOpen(false)}>{t('salesFunnel.cancel')}</Button>
          <Button
            variant="contained"
            onClick={confirmMoveLead}
            disabled={!selectedStageId}
          >
            {t('salesFunnel.move')}
          </Button>
        </DialogActions>
      </Dialog>
      <LeadDetailsModal
        open={!!viewLead}
        lead={viewLead}
        onClose={() => setViewLead(null)}
      />
    </MobileContainer>
  );
};

export default SalesFunnelMobile;
