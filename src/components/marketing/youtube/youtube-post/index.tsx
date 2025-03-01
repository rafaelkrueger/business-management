import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

const YouTubeNodeEditor = ({ editingNode, setEditingNode, isConnectedToChatGPT }) => {
  const { t } = useTranslation();

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert(t("youtubeNodeEditor.videoOnly"));
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
              youtubeVideoUrl: base64String,
              youtubeVideoFile: undefined,
            },
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearVideo = () => {
    setEditingNode({
      ...editingNode,
      data: {
        ...editingNode.data,
        params: {
          ...editingNode.data.params,
          youtubeVideoUrl: undefined,
          youtubeVideoFile: undefined,
        },
      },
    });
  };

  // Função para upload da thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("youtubeNodeEditor.imageOnly"));
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
              youtubeThumbnailUrl: base64String,
              youtubeThumbnailFile: undefined,
            },
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearThumbnail = () => {
    setEditingNode({
      ...editingNode,
      data: {
        ...editingNode.data,
        params: {
          ...editingNode.data.params,
          youtubeThumbnailUrl: undefined,
          youtubeThumbnailFile: undefined,
        },
      },
    });
  };

  return (
    <>
      {/* Input para o título do vídeo */}
      <TextField
        sx={{
          padding: "10px",
          width: "550px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("youtubeNodeEditor.videoTitle")}
        fullWidth
        inputProps={{ maxLength: 100 }}
        value={editingNode.data.params.youtubeTitle || ""}
        disabled={isConnectedToChatGPT()}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                youtubeTitle: e.target.value,
              },
            },
          })
        }
      />

      {/* Input para a descrição do vídeo */}
      <TextField
        sx={{
          padding: "10px",
          width: "550px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("youtubeNodeEditor.videoDescription")}
        fullWidth
        multiline
        rows={6}
        inputProps={{ maxLength: 5000 }}
        value={editingNode.data.params.youtubeDescription || ""}
        disabled={isConnectedToChatGPT()}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                youtubeDescription: e.target.value,
              },
            },
          })
        }
      />

      {/* Input para a categoria do vídeo */}
      <TextField
        sx={{
          padding: "10px",
          width: "550px",
          marginTop: "15px",
          marginRight: "15px",
          marginLeft: "15px",
          cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
        }}
        label={t("youtubeNodeEditor.videoCategory")}
        fullWidth
        placeholder={t("youtubeNodeEditor.categoryPlaceholder")}
        value={editingNode.data.params.youtubeCategory || ""}
        disabled={isConnectedToChatGPT()}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                youtubeCategory: e.target.value,
              },
            },
          })
        }
      />

      {/* Seção de upload do vídeo */}
      <Box
        sx={{
          padding: "10px",
          width: "550px",
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
          accept="video/*"
          style={{ display: "none" }}
          id="youtube-media-upload"
          type="file"
          onChange={handleVideoChange}
          disabled={isConnectedToChatGPT()}
        />
        <label htmlFor="youtube-media-upload">
          {!editingNode.data.params.youtubeVideoUrl && (
            <Button variant="contained" component="span">
              {t("youtubeNodeEditor.chooseVideo")}
            </Button>
          )}
        </label>

        {/* Pré-visualização do vídeo */}
        {editingNode.data.params.youtubeVideoUrl && (
          <Box sx={{ marginTop: "10px", textAlign: "center", position: "relative" }}>
            <video
              width="550"
              controls
              src={editingNode.data.params.youtubeVideoUrl}
              style={{ maxWidth: "550px", maxHeight: "300px" }}
            >
              {t("youtubeNodeEditor.videoNotSupported")}
            </video>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearVideo}
              sx={{ marginTop: "10px", position: "absolute", bottom: 10, right: 10 }}
            >
              <Trash2Icon />
            </Button>
          </Box>
        )}
      </Box>

      {/* Seção de upload da thumbnail */}
      <Box
        sx={{
          padding: "10px",
          width: "550px",
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
          id="youtube-thumbnail-upload"
          type="file"
          onChange={handleThumbnailChange}
          disabled={isConnectedToChatGPT()}
        />
        <label htmlFor="youtube-thumbnail-upload">
          {!editingNode.data.params.youtubeThumbnailUrl && (
            <Button variant="contained" component="span">
              {t("youtubeNodeEditor.chooseThumbnail")}
            </Button>
          )}
        </label>

        {/* Pré-visualização da thumbnail */}
        {editingNode.data.params.youtubeThumbnailUrl && (
          <Box sx={{ marginTop: "10px", textAlign: "center", position: "relative" }}>
            <img
              src={editingNode.data.params.youtubeThumbnailUrl}
              alt={t("youtubeNodeEditor.thumbnailPreview")}
              style={{ maxWidth: "300px", maxHeight: "200px" }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearThumbnail}
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

export default YouTubeNodeEditor;
