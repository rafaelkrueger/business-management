import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SegmentationService from '../../../../services/segmentation.service.ts';

interface LeadsNodeEditorProps {
  editingNode: any;
  setEditingNode: (node: any) => void;
  activeCompany: string;
}

const LeadsNodeEditor: React.FC<LeadsNodeEditorProps> = ({
  editingNode,
  setEditingNode,
  activeCompany,
}) => {
  const { t } = useTranslation();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setLoading(true);
        const response = await SegmentationService.getSegments(activeCompany);
        setSegments(response.data || []);
      } catch (error) {
        console.error('Error fetching segments:', error);
        setSegments([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeCompany) {
      fetchSegments();
    }
  }, [activeCompany]);

  const handleSegmentChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setEditingNode({
      ...editingNode,
      data: {
        ...editingNode.data,
        params: {
          ...editingNode.data.params,
          segments: value,
        },
      },
    });
  };

  return (
    <Box sx={{ p: 2, minWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        {t('block.leads')} - {t('automationFlow.selectSegments')}
      </Typography>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="segments-select-label">
          {t('automationFlow.segments')}
        </InputLabel>
        <Select
          labelId="segments-select-label"
          id="segments-select"
          multiple
          value={editingNode.data.params.segments || []}
          onChange={handleSegmentChange}
          input={<OutlinedInput label={t('automationFlow.segments')} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const segment = segments.find((seg: any) => seg.id === value);
                return (
                  <Chip
                    key={value}
                    label={segment ? segment.name : value}
                    size="small"
                  />
                );
              })}
            </Box>
          )}
          disabled={loading}
        >
          {segments.map((segment: any) => (
            <MenuItem key={segment.id} value={segment.id}>
              {segment.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {t('automationFlow.loadingSegments')}...
        </Typography>
      )}

      {!loading && segments.length === 0 && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {t('automationFlow.noSegmentsFound')}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {t('automationFlow.leadsBlockDescription')}
      </Typography>
    </Box>
  );
};

export default LeadsNodeEditor;
