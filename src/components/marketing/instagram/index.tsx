import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

const InstagramNodeEditor = ({ editingNode, setEditingNode, isConnectedToChatGPT }) => {
  const { t } = useTranslation();

  // Handle image selection for the post
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("instagramNodeEditor.imageOnly"));
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
              instagramMediaUrl: base64String,
              instagramMediaFile: undefined,
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
          instagramMediaUrl: undefined,
          instagramMediaFile: undefined,
        },
      },
    });
  };

  return (
    <>
      <TextField
        sx={{
          padding: "10px",
          width: "400px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("instagramNodeEditor.caption")}
        fullWidth
        multiline
        rows={4}
        inputProps={{ maxLength: 2200 }}
        helperText={`${editingNode.data.params.instagramCaption ? editingNode.data.params.instagramCaption.length : 0}/2200`}
        value={editingNode.data.params.instagramCaption || ""}
        disabled={isConnectedToChatGPT(editingNode.id)}
        onChange={(e) => {
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                instagramCaption: e.target.value,
              },
            },
          });
        }}
      />

      {/* Image upload section for the post */}
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
          accept="image/*,video/*"
          style={{ display: "none" }}
          id="instagram-media-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="instagram-media-upload">
          <Button variant="contained" component="span">
            {t("instagramNodeEditor.chooseMedia")}
          </Button>
        </label>

        {editingNode.data.params.instagramMediaUrl && (
          <Box sx={{ marginTop: "10px", textAlign: "center", position: "relative" }}>
            {editingNode.data.params.instagramMediaUrl.startsWith("data:image") ? (
              <img
                src={editingNode.data.params.instagramMediaUrl}
                alt={t("instagramNodeEditor.imagePreview")}
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            ) : (
              <video
                src={editingNode.data.params.instagramMediaUrl}
                controls
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            )}
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

export default InstagramNodeEditor;