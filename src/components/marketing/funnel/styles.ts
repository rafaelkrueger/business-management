import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Plus, MoreVertical, Search, Filter,
  CircleEllipsis, Trash2, FileEdit, GripVertical,
  User, ChevronDown, Check
} from 'lucide-react';

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
`;

const KanbanCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

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

  &.high {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &.medium {
    background-color: #fef3c7;
    color: #d97706;
  }

  &.low {
    background-color: #dcfce7;
    color: #16a34a;
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