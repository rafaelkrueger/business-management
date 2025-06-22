import { Box, Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TOPIC_OPTIONS = ['Technology', 'Health', 'Finance', 'Entertainment', 'Travel'];

const TrendingNodeEditor = ({ editingNode, setEditingNode }) => {
  const { t } = useTranslation();

  if (!editingNode) return null;

  return (
    <Box sx={{ width: '500px', p: 2 }}>
      <Autocomplete
        freeSolo
        options={TOPIC_OPTIONS}
        value={editingNode.data.params.topic || ''}
        onInputChange={(_, value) =>
          setEditingNode(prev => ({
            ...prev,
            data: {
              ...prev.data,
              params: {
                ...prev.data.params,
                topic: value,
              },
            },
          }))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('automationFlow.trendingQuestion')}
            fullWidth
          />
        )}
      />
    </Box>
  );
};

export default TrendingNodeEditor;
