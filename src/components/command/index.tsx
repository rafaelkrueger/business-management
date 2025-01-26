import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Drawer,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Visibility, Add, Close, Delete, Edit } from "@mui/icons-material";

const initialComandas = [
  { id: 1, table: "Mesa 1", status: "Aberta", items: [], observation: "", total: 0, openedAt: new Date() },
  { id: 2, table: "Mesa 2", status: "Fechada", items: [], observation: "", total: 0 },
];

const Command = () => {
  const [comandas, setComandas] = useState(initialComandas);
  const [selectedComanda, setSelectedComanda] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [comandaToDelete, setComandaToDelete] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setComandas((prevComandas) =>
        prevComandas.map((comanda) => {
          if (comanda.status === "Aberta" && comanda.openedAt) {
            const now = new Date();
            const elapsed = Math.floor((now - new Date(comanda.openedAt)) / 1000);
            return { ...comanda, elapsedTime: elapsed };
          }
          return comanda;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectComanda = (id) => {
    const comanda = comandas.find((c) => c.id === id);
    setSelectedComanda(comanda);
    setOpenDrawer(true);
  };

  const handleAddComanda = () => {
    const newComanda = {
      id: comandas.length + 1,
      table: `Mesa ${comandas.length + 1}`,
      status: "Aberta",
      items: [],
      observation: "",
      total: 0,
      openedAt: new Date(),
    };
    setComandas([...comandas, newComanda]);
  };

  const handleUpdateStatus = () => {
    if (!selectedComanda) return;
    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id
          ? {
              ...c,
              status: selectedComanda.status === "Aberta" ? "Fechada" : "Aberta",
              openedAt: selectedComanda.status === "Aberta" ? null : new Date(),
            }
          : c
      )
    );
    setOpenDrawer(false);
  };

  const handleObservationChange = (e) => {
    const updatedObservation = e.target.value;
    setSelectedComanda({ ...selectedComanda, observation: updatedObservation });
    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id
          ? { ...c, observation: updatedObservation }
          : c
      )
    );
  };

  const handleDeleteComanda = () => {
    setComandas(comandas.filter((c) => c.id !== comandaToDelete));
    setOpenDialog(false);
    setOpenDrawer(false);
  };

  const confirmDeleteComanda = (id) => {
    setComandaToDelete(id);
    setOpenDialog(true);
  };

  const handleRenameComanda = (newName) => {
    setSelectedComanda({ ...selectedComanda, table: newName });
    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id
          ? { ...c, table: newName }
          : c
      )
    );
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f8f9fa",
        maxHeight: "750px",
        minWidth: {sm:'100%', md:"1100px", lg:"1100px"},
        maxWidth: {sm:'100%', md:"1100px", lg:"1100px"},
        overflowY: "scroll",
        marginTop: { xs: "10%", sm: "0" },
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#aaa",
        },
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: { xs: "center", sm: "left" } }}>
        Gerenciamento de Comandas
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: "#6c757d", textAlign: { xs: "center", sm: "left" } }}>
        Organize as comandas do seu estabelecimento com agilidade e praticidade.
      </Typography>

      {/* Comanda List */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {comandas.map((comanda) => (
          <Grid item xs={12} sm={6} md={4} key={comanda.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                transition: "transform 0.3s ease",
                '&:hover': { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {comanda.table}
                </Typography>
                <Box
                  sx={{
                    display: "inline-block",
                    mt: 1,
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: "bold",
                    color: comanda.status === "Aberta" ? "#fff" : "#495057",
                    backgroundColor:
                      comanda.status === "Aberta" ? "#28a745" : "#dee2e6",
                  }}
                >
                  {comanda.status}
                </Box>
                {comanda.status === "Aberta" && comanda.elapsedTime != null && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Tempo Aberta:</strong> {formatElapsedTime(comanda.elapsedTime)}
                  </Typography>
                )}
                {comanda.status === "Fechada" && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Tempo Aberta:</strong> Fechada
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Observação:</strong> {comanda.observation.length > 20 ? comanda.observation.slice(0,20) + '...' : comanda.observation || "Nenhuma"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Total:</strong> R$ {comanda.total}
                </Typography>
              </CardContent>
              <Stack direction="row" justifyContent="space-between" mt={2}>
                <IconButton
                  color="primary"
                  onClick={() => handleSelectComanda(comanda.id)}
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => confirmDeleteComanda(comanda.id)}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Comanda */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Add />}
          onClick={handleAddComanda}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 8,
          }}
        >
          Adicionar Comanda
        </Button>
      </Box>

      {/* Side Panel for Selected Comanda */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: "100%", sm: 350 },
            p: 3,
            backgroundColor: "#f8f9fa",
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Detalhes da Comanda
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        {selectedComanda && (
          <Box>
            <Typography sx={{ mb: 1 }}>
              <strong>Mesa:</strong>
            </Typography>
            <TextField
              fullWidth
              label="Nome da Mesa"
              value={selectedComanda.table}
              onChange={(e) => handleRenameComanda(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography sx={{ mb: 2 }}>
              <strong>Status:</strong> {selectedComanda.status}
            </Typography>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={selectedComanda.observation}
              onChange={handleObservationChange}
              sx={{ mb: 2 }}
              maxRows={1}
            />
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handleUpdateStatus}
            sx={{ borderRadius: 8, fontWeight: "bold" }}
          >
            {selectedComanda?.status === "Aberta"
              ? "Fechar Comanda"
              : "Reabrir Comanda"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenDrawer(false)}
            sx={{ borderRadius: 8 }}
          >
            Cancelar
          </Button>
        </Stack>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta comanda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteComanda} color="secondary" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Command;
