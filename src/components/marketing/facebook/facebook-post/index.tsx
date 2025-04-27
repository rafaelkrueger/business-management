import React from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

const FacebookNodeEditor = ({ editingNode, setEditingNode, facebookPages, isConnectedToChatGPT }) => {
  const { t } = useTranslation();

  // Manipula a seleção de imagem para o post
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("facebookNodeEditor.imageOnly")); // Ex: "Apenas imagens são permitidas."
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setEditingNode({
          ...editingNode,
          data: {
            ...editingNode.data,
            params: {
              ...editingNode.data.params,
              facebookMediaUrl: base64String,
              facebookMediaFile: undefined,
            },
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setEditingNode({
      ...editingNode,
      data: {
        ...editingNode.data,
        params: {
          ...editingNode.data.params,
          facebookMediaUrl: undefined,
          facebookMediaFile: undefined,
        },
      },
    });
  };

  return (
    <>
      <TextField
        select
        label="Selecione a Página"
        value={
          editingNode.data.params.selectedPage
            ? JSON.stringify(editingNode.data.params.selectedPage)
            : ""
        }
        onChange={(e) => {
          const selectedPage = JSON.parse(e.target.value);
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                selectedPage: selectedPage,
              },
            },
          });
        }}
        sx={{ marginTop: "15px", width: "91%", marginLeft: "28px" }}
      >
        {facebookPages &&
          facebookPages.map((page) => (
            <MenuItem key={page.id} value={JSON.stringify(page)}>
              {page.name}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        sx={{
          padding: "10px",
          width: "400px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={"Facebook text content"}
        fullWidth
        multiline
        rows={4}
        inputProps={{ maxLength: 1300 }}
        helperText={`${editingNode.data.params.facebookContent ? editingNode.data.params.facebookContent.length : 0}/1300`}
        value={editingNode.data.params.facebookContent || ""}
        disabled={isConnectedToChatGPT(editingNode.id)}
        onChange={(e) => {
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                facebookContent: e.target.value,
              },
            },
          });
        }}
      />

      {/* Seção de upload de imagem para o post */}
      <Box
        sx={{
          padding: "10px",
          width: "400px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px dashed #ccc",
          borderRadius: "8px",
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="facebook-media-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="facebook-media-upload">
          <Button variant="contained" component="span">
            {t("twitterNodeEditor.chooseImage")}
          </Button>
        </label>

        {editingNode.data.params.facebookMediaUrl && (
          <Box sx={{ marginTop: "10px", textAlign: "center", position: "relative" }}>
            <img
              src={editingNode.data.params.facebookMediaUrl}
              alt={t("facebookNodeEditor.imagePreview")}
              style={{ maxWidth: "300px", maxHeight: "200px" }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearImage}
              sx={{ marginTop: "10px", position: "absolute", bottom: 10, right: 10 }}
            >
              <Trash2Icon />
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default FacebookNodeEditor;
