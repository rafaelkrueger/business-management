import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Checkbox,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EnterpriseService from "../../services/enterprise.service.ts";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { AllInOneApi } from "../../Api.ts";

export const CreateEnterpriseModal = ({ userData, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [enterprise, setEnterprise] = useState({
    userId: userData._id,
    logo: "",
    name: "",
    email: "",
    phone: "",
    document: "",
    active: true,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Estado para erros dos campos obrigatórios
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnterprise({ ...enterprise, [name]: value });
    // Limpa o erro se o campo obrigatório estiver preenchido
    if (["name", "email", "phone"].includes(name) && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEnterprise({ ...enterprise, logo: file });
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEnterprise({ ...enterprise, [name]: checked });
  };

  // Função de validação: apenas nome, email e telefone são obrigatórios
  const validateForm = () => {
    const newErrors = {};
    if (!enterprise.name.trim()) {
      newErrors.name = t("error.nameRequired");
    }
    if (!enterprise.email.trim()) {
      newErrors.email = t("error.emailRequired");
    }
    if (!enterprise.phone.trim()) {
      newErrors.phone = t("error.cellphoneRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    let imageUrl = "";
    const formData = new FormData();

    for (const [key, value] of Object.entries(enterprise)) {
      if (value !== undefined && value !== null) {
        if (key === "logo" && value) {
          const formDataFile = new FormData();
          formDataFile.append("path", "logos");
          formDataFile.append("file", value);

          try {
            const response = await AllInOneApi.post(
              "shared/image",
              formDataFile,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  accept: "*/*",
                },
              }
            );
            imageUrl = response.data.url;
          } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            enqueueSnackbar(
              t("createEnterpriseModal.errorImageUpload"),
              { variant: "error" }
            );
            setIsLoading(false);
            return;
          }
        } else {
          formData.append(key, value);
        }
      }
    }

    formData.append("logo", imageUrl);

    EnterpriseService.post(formData)
      .then(() => {
        enqueueSnackbar(t("createEnterpriseModal.successMessage"), {
          variant: "success",
        });
        onClose();
      })
      .catch((err) => {
        console.error("Erro ao criar empresa:", err);
        enqueueSnackbar(t("createEnterpriseModal.errorMessage"), {
          variant: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  // Estilo para as mensagens de erro (cor menos agressiva)
  const errorStyle = { color: "#E57373", fontSize: "12px", mt: "-15px", mb: "12px" };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-enterprise-modal"
      aria-describedby="modal-to-create-enterprise"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", sm: "90%", md: "500px" },
          maxWidth: { xs: "300px", sm: "300px", md: "400px", lg: "400px" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: { xs: 0, sm: 2 },
          p: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            {t("createEnterpriseModal.title")}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Preview da Logo */}
        {logoPreview && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src={logoPreview}
              alt={t("createEnterpriseModal.logoPreviewAlt")}
              style={{
                maxWidth: "100%",
                maxHeight: "150px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </Box>
        )}

        {/* Formulário */}
        <Box component="form" sx={{ display: "grid", gap: 2 }}>
          {/* Input de Logo */}
          <Button variant="outlined" component="label" fullWidth>
            {t("createEnterpriseModal.logo")}
            <input
              type="file"
              hidden
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {/* Nome */}
          <TextField
            label={t("createEnterpriseModal.name")}
            name="name"
            value={enterprise.name}
            onChange={handleChange}
            placeholder={t("createEnterpriseModal.namePlaceholder")}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
            FormHelperTextProps={{ sx: errorStyle }}
          />

          {/* Email */}
          <TextField
            label={t("createEnterpriseModal.email")}
            name="email"
            value={enterprise.email}
            onChange={handleChange}
            placeholder={t("createEnterpriseModal.emailPlaceholder")}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
            FormHelperTextProps={{ sx: errorStyle }}
          />

          {/* Telefone */}
          <TextField
            label={t("createEnterpriseModal.phone")}
            name="phone"
            value={enterprise.phone}
            onChange={handleChange}
            placeholder={t("createEnterpriseModal.phonePlaceholder")}
            fullWidth
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            FormHelperTextProps={{ sx: errorStyle }}
          />

        <TextField
          label={t("createEnterpriseModal.industry")}
          name="industry"
          value={enterprise.industry || ""}
          onChange={handleChange}
          placeholder={t("createEnterpriseModal.industryPlaceholder")}
          fullWidth
        />


          {/* Ativo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              id="active"
              name="active"
              checked={enterprise.active}
              onChange={handleCheckboxChange}
            />
            <Typography variant="body1">
              {t("createEnterpriseModal.active")}
            </Typography>
          </Box>

          {/* Botão de Enviar */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("createEnterpriseModal.createButton")
            )}
          </Button>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {t("createEnterpriseModal.infoMessage")}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateEnterpriseModal;
