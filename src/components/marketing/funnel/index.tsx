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
  MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  Plus, MoreVertical, Search, Filter,
  CircleEllipsis, Trash2, FileEdit, GripVertical,
  User, ChevronDown, Check, Phone, Mail, Calendar, DollarSign, UserPlus
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import CrmService from '../../../services/crm.service.ts';
import SegmentationService from '../../../services/segmentation.service.ts';
import FunnelService from '../../../services/funnel.service.ts';

// ======================
// Estilos com Styled Components
// ======================

const KanbanContainer = styled.div`
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 24px;
`;

const KanbanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  width: 240px;

  input {
    border: none;
    margin-left: 8px;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: #64748b;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SegmentSelect = styled.select`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #64748b;
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 24px;
`;

const KanbanColumn = styled.div`
  min-width: 300px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ColumnTitle = styled.div`
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

const Badge = styled.span`
  background-color: #e2e8f0;
  color: #475569;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AddCardButton = styled.button`
  background-color: #578acd;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #3a6db7;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 10;
  min-width: 120px;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  color: #475569;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  min-height: 100px;
`;

const KanbanCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid ${props => props.isDragging ? '#578acd' : '#f1f5f9'};
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background-color: ${props => props.isDragging ? '#f0f7ff' : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border-color: #e2e8f0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

const DragHandle = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: grab;
  display: flex;
  align-items: center;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const Avatars = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #64748b;
`;

const AddUserButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  color: #578acd;
  cursor: pointer;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PriorityTag = styled.span`
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

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const EmptyState = styled.div`
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

const LeadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const LeadDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;

  svg {
    flex-shrink: 0;
  }
`;

const ValueTag = styled.span`
  background-color: #dcfce7;
  color: #16a34a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const SourceTag = styled.span`
  background-color: #ede9fe;
  color: #7c3aed;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

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
// Componentes React
// ======================

const KanbanCardComponent = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <KanbanCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <PriorityTag className={card.priority}>{card.priority}</PriorityTag>
          <CardHeader>
            <h4>{card.title}</h4>
            <DragHandle>
              <GripVertical size={14} />
            </DragHandle>
          </CardHeader>

          <LeadInfo>
            <LeadDetail>
              <Phone size={12} />
              <span>{card.phone}</span>
            </LeadDetail>
            <LeadDetail>
              <Mail size={12} />
              <span>{card.email}</span>
            </LeadDetail>
            <LeadDetail>
              <Calendar size={12} />
              <span>{card.lastContact}</span>
            </LeadDetail>
          </LeadInfo>

          <CardFooter>
            <Avatars>
              <Avatar><User size={12} /></Avatar>
              <AddUserButton>
                <Plus size={12} />
              </AddUserButton>
            </Avatars>
            <div>
              <ValueTag>
                <DollarSign size={12} />
                {card.value}
              </ValueTag>
              <SourceTag>{card.source}</SourceTag>
            </div>
          </CardFooter>
        </KanbanCard>
      )}
    </Draggable>
  );
};

const KanbanColumnComponent = ({ column, onAddCard, index }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Droppable droppableId={column.id} type="card">
      {(provided, snapshot) => (
        <KanbanColumn
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
        >
          <ColumnHeader>
            <ColumnTitle>
              <h3>{column.title}</h3>
              <Badge>{column.cards.length}</Badge>
            </ColumnTitle>
            <ColumnActions>
              <AddCardButton onClick={onAddCard}>
                <Plus size={16} />
              </AddCardButton>
              <DropdownContainer>
                <MenuButton onClick={() => setShowMenu(!showMenu)}>
                  <MoreVertical size={16} />
                </MenuButton>
                {showMenu && (
                  <DropdownMenu>
                    <DropdownItem>
                      <FileEdit size={14} /> {t('kanban.edit')}
                    </DropdownItem>
                    <DropdownItem>
                      <Trash2 size={14} /> {t('kanban.delete')}
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </DropdownContainer>
            </ColumnActions>
          </ColumnHeader>
          <CardsContainer>
            {column.cards.length > 0 ? (
              column.cards.map((card, index) => (
                <KanbanCardComponent key={card.id} card={card} index={index} />
              ))
            ) : (
              <EmptyState onClick={onAddCard}>
                <Plus size={18} /> {t('kanban.addFirstCard')}
              </EmptyState>
            )}
            {provided.placeholder}
          </CardsContainer>
        </KanbanColumn>
      )}
    </Droppable>
  );
};

const SalesFunnel: React.FC<{ activeCompany?: string }> = ({ activeCompany }) => {
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

  useEffect(() => {
    if (!activeCompany) return;
    fetchInitialData();
  }, [activeCompany]);

  const fetchInitialData = async () => {
    try {
      const [leadRes, segmentRes] = await Promise.all([
        CrmService.getCrm(activeCompany),
        SegmentationService.getSegments(activeCompany)
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
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    }
  };

  useEffect(() => {
    updateColumns();
  }, [leads, selectedSegment, searchText]);

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
    const statuses = ['lead', 'prospect', 'customer', 'churned'];
    const newColumns = statuses.map(status => ({
      id: status,
      title: status.charAt(0).toUpperCase() + status.slice(1),
      cards: filtered.filter(l => (l.status || 'lead').toLowerCase() === status).map(l => ({
        id: l.id,
        title: l.name || 'Lead',
        email: l.email,
        phone: l.phone,
        lastContact: dayjs(l.lastContact).format('DD/MM/YYYY'),
        priority: 'hot',
        value: l.value,
        source: l.source
      }))
    }));
    setColumns(newColumns);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    const sourceCards = [...sourceColumn.cards];
    const [removed] = sourceCards.splice(source.index, 1);

    if (sourceColumn.id === destColumn.id) {
      sourceCards.splice(destination.index, 0, removed);
      setColumns(prev => prev.map(col => col.id === sourceColumn.id ? { ...col, cards: sourceCards } : col));
    } else {
      const destCards = [...destColumn.cards];
      destCards.splice(destination.index, 0, removed);
      setColumns(prev => prev.map(col => {
        if (col.id === sourceColumn.id) return { ...col, cards: sourceCards };
        if (col.id === destColumn.id) return { ...col, cards: destCards };
        return col;
      }));
      setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: destColumn.id } : l));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <KanbanContainer>
        <KanbanHeader>
          <h1>{t('kanban.title')}</h1>
          <Controls>
            <SearchBox>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder={t('salesFunnel.searchPlaceholder') || t('kanban.search')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </SearchBox>
            <SegmentSelect value={selectedSegment || ''} onChange={(e) => setSelectedSegment(e.target.value || null)}>
              <option value="">{t('marketing.crm.selectSegment')}</option>
              {segments.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </SegmentSelect>
            <FilterButton style={{ backgroundColor: '#578acd', color: 'white' }}>
              <UserPlus size={16} />
              {t('kanban.addLead')}
            </FilterButton>
            <FilterButton onClick={() => setFunnelModalOpen(true)}>
              <Plus size={16} />
              {t('salesFunnel.createFunnel')}
            </FilterButton>
          </Controls>
        </KanbanHeader>

        <ColumnsContainer>
          {columns.map((column, index) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              index={index}
              onAddCard={() => {}}
            />
          ))}
        </ColumnsContainer>
      </KanbanContainer>
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
            } catch (err) {
              console.error('Erro ao criar funil', err);
              enqueueSnackbar('Erro ao criar funil', { variant: 'error' });
            }
          }}>{t('salesFunnel.save')}</Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );

};

export default SalesFunnel;

