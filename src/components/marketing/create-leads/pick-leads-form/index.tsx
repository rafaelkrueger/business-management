import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import LeadsService from "../../../../services/leads.service.ts";

const PickLeadsForm = ({ editingNode, setEditingNode, activeCompany }) => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    LeadsService.getForms(activeCompany)
      .then((res) => {
        setForms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activeCompany]);

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
          const selectedForm = forms.find((f) => f.id === selectedId);

          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                formId: selectedForm.id,
                formTitle: selectedForm.title,
              },
            },
          });
        }}
        fullWidth
        size="small"
      >
        {forms.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.title}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default PickLeadsForm;
