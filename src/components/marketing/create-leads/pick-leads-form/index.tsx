import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LeadsService from "../../../../services/leads.service.ts";

const PickLeadsForm = ({ editingNode, setEditingNode, activeCompany }) => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const selectedForm = forms.find(f => f.id === editingNode?.data?.params?.formId);

  useEffect(() => {
    LeadsService.getForms(activeCompany)
      .then((res) => setForms(res.data))
      .catch((err) => console.log(err));
  }, [activeCompany]);

  const handleFieldToggle = (fieldName) => {
    const current = editingNode?.data?.params?.selectedFields || [];
    const updatedFields = current.includes(fieldName)
      ? current.filter(f => f !== fieldName)
      : [...current, fieldName];

    setEditingNode({
      ...editingNode,
      data: {
        ...editingNode.data,
        params: {
          ...editingNode.data.params,
          selectedFields: updatedFields
        }
      }
    });
  };

  return (
    <Box sx={{ width: '500px', padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {t('marketing.capturePages.selectInputTitle')}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {t('marketing.capturePages.selectInputDescription')}
      </Typography>

      <TextField
        select
        value={editingNode?.data?.params?.formId || ""}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selected = forms.find((f) => f.id === selectedId);
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                formId: selected.id,
                formTitle: selected.title,
                selectedFields: [],
                useFormData: false
              }
            }
          });
        }}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      >
        {forms.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.title}
          </MenuItem>
        ))}
      </TextField>

      {selectedForm && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={editingNode?.data?.params?.useFormData || false}
                onChange={(e) => {
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        useFormData: e.target.checked
                      }
                    }
                  });
                }}
              />
            }
            label={t('marketing.capturePages.automationNextBlocks')}
          />

          {editingNode?.data?.params?.useFormData && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t('marketing.capturePages.automationSelectFields')}
              </Typography>
              <FormGroup>
                {selectedForm.fields.map((field, i) => (
                  <FormControlLabel
                    key={i}
                    control={
                      <Checkbox
                        checked={editingNode?.data?.params?.selectedFields?.includes(field.name) || false}
                        onChange={() => handleFieldToggle(field.name)}
                      />
                    }
                    label={field.name}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PickLeadsForm;
