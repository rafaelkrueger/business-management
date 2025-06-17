import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Plus, MoreVertical, Search, Filter,
  CircleEllipsis, Trash2, FileEdit, GripVertical,
  User, ChevronDown, Check, Phone, Mail, Calendar, DollarSign, UserPlus
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const SalesFunnel = () => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState([
    {
      id: 'new',
      title: t('kanban.newLeads'),
      cards: [
        {
          id: '1',
          title: t('kanban.card1'),
          email: 'marcos@empresa.com',
          phone: '(11) 99999-8888',
          lastContact: t('kanban.today'),
          priority: 'hot',
          value: t('kanban.value1'),
          source: t('kanban.source1')
        },
        {
          id: '2',
          title: t('kanban.card2'),
          email: 'ana@startup.com',
          phone: '(21) 98888-7777',
          lastContact: t('kanban.yesterday'),
          priority: 'warm',
          value: t('kanban.value2'),
          source: t('kanban.source2')
        }
      ]
    },
    {
      id: 'contacted',
      title: t('kanban.contacted'),
      cards: [
        {
          id: '3',
          title: t('kanban.card3'),
          email: 'carlos@tech.com',
          phone: '(31) 97777-6666',
          lastContact: t('kanban.today'),
          priority: 'hot',
          value: t('kanban.value3'),
          source: t('kanban.source3')
        }
      ]
    },
    {
      id: 'proposal',
      title: t('kanban.proposalSent'),
      cards: [
        {
          id: '4',
          title: t('kanban.card4'),
          email: 'juliana@consulting.com',
          phone: '(41) 96666-5555',
          lastContact: t('kanban.twoDaysAgo'),
          priority: 'cold',
          value: t('kanban.value4'),
          source: t('kanban.source1')
        }
      ]
    },
    {
      id: 'closed',
      title: t('kanban.closed'),
      cards: [
        {
          id: '5',
          title: t('kanban.card5'),
          email: 'roberto@industria.com',
          phone: '(51) 95555-4444',
          lastContact: t('kanban.lastWeek'),
          priority: 'cold',
          value: t('kanban.value5'),
          source: t('kanban.source4')
        }
      ]
    }
  ]);

  const addCard = (columnId) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? {
            ...col,
            cards: [...col.cards, {
              id: Date.now().toString(),
              title: t('kanban.newCard'),
              email: 'novo@lead.com',
              phone: '(00) 00000-0000',
              lastContact: t('kanban.today'),
              priority: ['hot', 'warm', 'cold'][Math.floor(Math.random() * 3)],
              value: t('kanban.newValue'),
              source: t('kanban.newSource')
            }]
          }
        : col
    ));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Se não tiver destino válido (soltar fora de uma área droppable)
    if (!destination) {
      return;
    }

    // Se o card foi solto no mesmo lugar
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Encontrar a coluna de origem
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    // Encontrar a coluna de destino
    const destColumn = columns.find(col => col.id === destination.droppableId);

    // Se for a mesma coluna, reordenar
    if (sourceColumn.id === destColumn.id) {
      const newCards = [...sourceColumn.cards];
      // Remover o card da posição de origem
      const [removed] = newCards.splice(source.index, 1);
      // Inserir na posição de destino
      newCards.splice(destination.index, 0, removed);

      // Atualizar a coluna
      setColumns(prev => prev.map(col =>
        col.id === sourceColumn.id ? { ...col, cards: newCards } : col
      ));
    } else {
      // Movendo entre colunas

      // Remover da coluna de origem
      const sourceCards = [...sourceColumn.cards];
      const [removed] = sourceCards.splice(source.index, 1);

      // Adicionar na coluna de destino
      const destCards = [...destColumn.cards];
      destCards.splice(destination.index, 0, removed);

      setColumns(prev => prev.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, cards: sourceCards };
        } else if (col.id === destColumn.id) {
          return { ...col, cards: destCards };
        } else {
          return col;
        }
      }));
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
              <input type="text" placeholder={t('kanban.search')} />
            </SearchBox>
            <FilterButton>
              <Filter size={18} color="#64748b" />
              {t('kanban.filter')}
              <ChevronDown size={16} color="#64748b" />
            </FilterButton>
            <FilterButton style={{ backgroundColor: '#578acd', color: 'white' }}>
              <UserPlus size={16} />
              {t('kanban.addLead')}
            </FilterButton>
          </Controls>
        </KanbanHeader>

        <ColumnsContainer>
          {columns.map((column, index) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              index={index}
              onAddCard={() => addCard(column.id)}
            />
          ))}
        </ColumnsContainer>
      </KanbanContainer>
    </DragDropContext>
  );
};

export default SalesFunnel;