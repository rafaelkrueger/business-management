import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

const TwitterNodeEditor = ({ editingNode, setEditingNode, isConnectedToChatGPT }) => {
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("twitterNodeEditor.imageOnly"));
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
              tweetMediaUrl: base64String,
              tweetMediaFile: undefined,
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
          tweetMediaUrl: undefined,
          tweetMediaFile: undefined,
        },
      },
    });
  };

  return (
    <>
      {/* Input para o título do tweet */}
      <TextField
        sx={{
          padding: "10px",
          width: "400px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("twitterNodeEditor.tweetTitle")}
        fullWidth
        value={editingNode.data.params.tweetTitle || ""}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                tweetTitle: e.target.value,
              },
            },
          })
        }
      />

      {/* Input para o conteúdo do tweet */}
      <TextField
        sx={{
          padding: "10px",
          width: "400px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("twitterNodeEditor.noTweetDefined")}
        fullWidth
        multiline
        rows={3}
        inputProps={{ maxLength: 280 }}
        helperText={`${editingNode.data.params.tweetContent.length}/280`}
        value={editingNode.data.params.tweetContent || ""}
        disabled={isConnectedToChatGPT()}
        onChange={(e) => {
          if (e.target.value.length <= 280) {
            setEditingNode({
              ...editingNode,
              data: {
                ...editingNode.data,
                params: {
                  ...editingNode.data.params,
                  tweetContent: e.target.value,
                },
              },
            });
          }
        }}
      />

      {/* Seção de upload de imagem */}
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
        {/* Input de arquivo oculto que aceita apenas imagens */}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="twitter-media-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="twitter-media-upload">
          <Button variant="contained" component="span">
            {t("twitterNodeEditor.chooseImage")}
          </Button>
        </label>

        {/* Pré-visualização da imagem selecionada */}
        {editingNode.data.params.tweetMediaUrl && (
          <Box sx={{ marginTop: "10px", textAlign: "center" }}>
            <img
              src={editingNode.data.params.tweetMediaUrl}
              alt={t("twitterNodeEditor.imagePreview")}
              style={{ maxWidth: "300px", maxHeight: "200px" }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearImage}
              sx={{ marginTop: "10px", position:'absolute', bottom:110, right:40 }}
            >
              <Trash2Icon/>
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default TwitterNodeEditor;
