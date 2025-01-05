import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Drawer,
  Divider,
  IconButton,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

const initialComandas = [
  { id: 1, table: "Mesa 1", status: "Aberta", items: [] },
  { id: 2, table: "Mesa 2", status: "Fechada", items: [] },
];

const Command = () => {
  const [comandas, setComandas] = useState(initialComandas);
  const [selectedComanda, setSelectedComanda] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

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
            }
          : c
      )
    );
    setOpenDrawer(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Comandas
      </Typography>

      {/* Comanda List */}
      <Grid container spacing={3}>
        {comandas.map((comanda) => (
          <Grid item xs={12} sm={6} md={4} key={comanda.id}>
            <Card
              sx={{
                border: "1px solid",
                borderColor: comanda.status === "Aberta" ? "green" : "gray",
              }}
            >
              <CardContent>
                <Typography variant="h6">{comanda.table}</Typography>
                <Chip
                  label={comanda.status}
                  color={comanda.status === "Aberta" ? "success" : "warning"}
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleSelectComanda(comanda.id)}
              >
                Detalhes
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Comanda */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAddComanda}
        >
          Adicionar Comanda
        </Button>
      </Stack>

      {/* Side Panel for Selected Comanda */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ width: 300 }}
      >
        <Box sx={{ p: 3, width: 300 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Detalhes da Comanda</Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              {/* <CloseIcon /> */}
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {selectedComanda && (
            <Box>
              <Typography>
                <strong>Mesa:</strong> {selectedComanda.table}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedComanda.status}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              onClick={handleUpdateStatus}
            >
              {selectedComanda?.status === "Aberta"
                ? "Fechar Comanda"
                : "Reabrir Comanda"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenDrawer(false)}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Command;
