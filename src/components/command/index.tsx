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
import { Visibility, Add, Close, Delete, Edit, AddCircleOutline, Info } from "@mui/icons-material";
import ProductsSelectModal from './ProductsSelectModal.tsx';
import { useTranslation } from 'react-i18next';
import OrdersService from "../../services/orders.service.ts";
import { useSnackbar } from "notistack";
import ProductService from '../../services/product.service.ts';
import Tippy from "@tippyjs/react";
const initialComandas = [];

const Command: React.FC<{ activeCompany: string, userData: any }> = ({ activeCompany, userData }) => {
  const { t } = useTranslation();
  const [comandas, setComandas] = useState([]);
  const [selectedComanda, setSelectedComanda] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [comandaToDelete, setComandaToDelete] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [activeDrawerSection, setActiveDrawerSection] = useState('edit');
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const interval = setInterval(() => {
      setComandas((prevComandas) =>
        prevComandas.map((comanda) => {
          if (comanda.status === t("orders.open") && comanda.openedAt) {
            const now = new Date();
            const elapsed = Math.floor((now - new Date(comanda.openedAt)) / 1000);
            return { ...comanda, elapsedTime: elapsed };
          }
          return comanda;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [t]);

  const handleSaveComanda = async () => {
    if (!selectedComanda) return;

    try {
      await OrdersService.edit(selectedComanda);
      enqueueSnackbar('Order saved successfully', { variant: "success" });

      const response = await OrdersService.get(activeCompany);
      setComandas(response.data);

      setOpenDrawer(false);
    } catch (error) {
      console.error("Erro ao salvar a comanda:", error);
      enqueueSnackbar('Error while saving order', { variant: "error" });
    }
  };


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrdersService.get(activeCompany);
        setComandas(response.data);
      } catch (error) {
        console.error("Erro ao buscar as comandas:", error);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      setComandas((prevComandas) =>
        prevComandas.map((comanda) => {
          if (comanda.status === 'open' && comanda.createdAt) {
            const now = new Date();
            const elapsed = Math.floor((now - new Date(comanda.createdAt)) / 1000);
            return { ...comanda, elapsedTime: elapsed };
          }
          return comanda;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeCompany && openDrawer) {
        ProductService.get(activeCompany)
            .then((res) => {
                setAvailableProducts(res.data);
            })
            .catch((err) => {
                console.error("Erro ao buscar os produtos:", err);
                setAvailableProducts([]);
            });
    }
  }, [activeCompany, openDrawer]);

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
    setSelectedComanda({ ...comanda });
    setOpenDrawer(true);
  };


  const handleAddComanda = async () => {
    try {
      await OrdersService.post({ companyId: activeCompany });
      enqueueSnackbar('Order Added +', { variant: "success" });
      const response = await OrdersService.get(activeCompany);
      setComandas(response.data);
    } catch (error) {
      console.error("Erro ao criar a comanda:", error);
      enqueueSnackbar('Error while adding order', { variant: "error" });
    }
  };


  const handleUpdateStatus = async () => {
    if (!selectedComanda) return;

    const updatedStatus = selectedComanda.status === 'open' ? 'closed' : 'open';
    const updatedComanda = {
      ...selectedComanda,
      status: updatedStatus,
      openedAt: updatedStatus === t("orders.open") ? new Date() : null
    };

    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id ? updatedComanda : c
      )
    );

    try {
      await OrdersService.edit(updatedComanda); // Salva o status atualizado no backend
      enqueueSnackbar(`Order ${updatedStatus === t("orders.open") ? 'reopened' : 'closed'}`, { variant: "success" });

      // Atualiza as comandas após fechar/reabrir
      const response = await OrdersService.get(activeCompany);
      setComandas(response.data);
    } catch (error) {
      console.error("Erro ao atualizar o status da comanda:", error);
      enqueueSnackbar('Error while updating order status', { variant: "error" });
    }

    setOpenDrawer(false);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };


  const handleObservationChange = (e) => {
    const updatedObservation = e.target.value;
    const updatedComanda = { ...selectedComanda, observation: updatedObservation };

    setSelectedComanda(updatedComanda);

    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id ? updatedComanda : c
      )
    );
  };


  const handleDeleteComanda = async (orderId) => {
    try {
      await OrdersService.delete(orderId);
      enqueueSnackbar('Order deleted', { variant: "success" });
      const response = await OrdersService.get(activeCompany);
      setComandas(response.data);
    } catch (error) {
      console.error("Erro ao criar a comanda:", error);
      enqueueSnackbar('Error while deleting order', { variant: "error" });
    }
  };


  const handleRenameComanda = (newName) => {
    const updatedComanda = { ...selectedComanda, tableName: newName };

    setSelectedComanda(updatedComanda);

    setComandas(
      comandas.map((c) =>
        c.id === selectedComanda.id ? updatedComanda : c
      )
    );
  };

  const handleAddProductToComanda = async (product) => {
    if (!selectedComanda || !activeCompany) {
      enqueueSnackbar('Select a command first.', { variant: "warning" });
      return;
    }

    try {
      await OrdersService.addProduct({
        companyId: activeCompany,
        orderId: selectedComanda.id,
        productId: product.id
      });

      enqueueSnackbar(t('orders.productAdded'), { variant: 'success' });

      const response = await OrdersService.get(activeCompany);
      setComandas(response.data);

      const updatedComanda = response.data.find(c => c.id === selectedComanda.id);
      setSelectedComanda(updatedComanda);

    } catch (error) {
      console.error("Erro ao adicionar produto à comanda:", error);
      enqueueSnackbar(t('orders.addProductError'), { variant: 'error' });
    }
  };


  const EditComandaSection = ({ selectedComanda, handleRenameComanda, handleObservationChange }) => (
    <Box>
      <TextField
        fullWidth
        label={t("orders.tableName")}
        value={selectedComanda?.tableName}
        onChange={(e) => handleRenameComanda(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <Typography sx={{ mb: 2 }}>
        <strong>{t("orders.status")}:</strong> {selectedComanda?.status}
      </Typography>
      <TextField
        fullWidth
        label={t("orders.observation")}
        multiline
        rows={3}
        default={selectedComanda?.obs}
        onChange={handleObservationChange}
        sx={{ mb: 2 }}
        maxRows={1}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );

  const ConsumedProductsSection = ({ selectedComanda, consumedProducts }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const handleRemoveProductFromComanda = async (productId) => {
      try {
        await OrdersService.removeProduct({
          companyId: selectedComanda.enterpriseId,
          orderId: selectedComanda.id,
          productId: productId
        });

        enqueueSnackbar('Product removed successfully!', { variant: "success" });

        const updatedProducts = consumedProducts.filter(product => product.id !== productId);
        setConsumedProducts(updatedProducts);

        const response = await OrdersService.get(selectedComanda.enterpriseId);
        const updatedComanda = response.data.find(c => c.id === selectedComanda.id);
        setSelectedComanda(updatedComanda);

      } catch (error) {
        console.error("Error removing product from order:", error);
        enqueueSnackbar('Error while removing product.', { variant: "error" });
      }
    };

    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("orders.consumedProducts")}
        </Typography>

        {consumedProducts.length > 0 ? (
          consumedProducts.map((product) => (
            <Box
              key={product.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                p: 1,
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      marginRight: "10px"
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "10px"
                    }}
                  >
                    <Typography variant="caption">{t("orders.noImage")}</Typography>
                  </Box>
                )}
                <Typography>{product.name}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: 2 }}>$ {product.price}</Typography>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveProductFromComanda(product.id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "#6c757d" }}>
            {t("orders.noProducts")}
          </Typography>
        )}
      </Box>
    );
  };

  const [consumedProducts, setConsumedProducts] = useState([]);

  useEffect(() => {
    if(openDrawer === false){
      setConsumedProducts([])
    }else{
      const fetchConsumedProducts = async () => {
        if (
          activeDrawerSection === 'consumed' && // Verifica se a aba ativa é a de produtos consumidos
          selectedComanda &&
          selectedComanda.productIds.length > 0
        ) {
          try {
            const response = await ProductService.getProductsByIds(selectedComanda.productIds);
            setConsumedProducts(response.data);
          } catch (error) {
            console.error("Erro ao buscar produtos consumidos:", error);
          }
        }
      };

      fetchConsumedProducts();
    }
  }, [selectedComanda, activeDrawerSection, openDrawer]);

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
      <div style={{display:'flex'}}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: { xs: "center", sm: "left" } }}>
        {t("orders.title")}
      </Typography>
      <Tippy content={t('orders.tooltipText')} placement="right">
          <Info size={20} style={{ marginLeft: '10px', cursor: 'pointer', marginTop:'1%' }} />
      </Tippy>
      </div>
      <Typography variant="subtitle1" gutterBottom sx={{ color: "#6c757d", textAlign: { xs: "center", sm: "left" } }}>
        {t("orders.description")}
      </Typography>

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
                  {comanda.tableName}
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
                    color: comanda.status === t("orders.open") ? "#fff" : "#495057",
                    backgroundColor:
                      comanda.status === t("orders.open") ? "#28a745" : "#dee2e6",
                  }}
                >
                  {comanda.status == 'open' ? t('orders.open') : t('orders.closed')}
                </Box>
                {comanda.status === t("orders.open") && comanda.elapsedTime != null && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>{t("orders.openTime")}:</strong> {formatElapsedTime(comanda.elapsedTime)}
                  </Typography>
                )}
                {comanda.status === t("orders.closed") && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>{t("orders.openTime")}:</strong> {t("orders.closed")}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>{t("orders.observation")}:</strong> {comanda.obs ?.length > 20 ? comanda.obs.slice(0,20) + '...' : comanda.obs || t("orders.none")}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>{t("orders.total")}:</strong>$ {comanda.totalAmount}
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
                  onClick={() => handleDeleteComanda(comanda.id)}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          {t("orders.addOrder")}
        </Button>
      </Box>

      {/* Side Panel for Selected Comanda */}
      <Drawer
      anchor="right"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: "90%", sm: '90%', md:'25%' },
          p: 3,
          backgroundColor: "#f8f9fa",
        },
      }}
    >
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      {t("orders.details")}
    </Typography>
    <IconButton onClick={() => setOpenDrawer(false)}>
      <Close />
    </IconButton>
  </Stack>

  {/* Navegação entre sessões */}
  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
    <Button
      variant={activeDrawerSection === 'edit' ? "contained" : "outlined"}
      onClick={() => setActiveDrawerSection('edit')}
      sx={{ borderRadius: 8, flex: 1 }}
    >
      {t("orders.edit")}
    </Button>
    <Button
      variant={activeDrawerSection === 'consumed' ? "contained" : "outlined"}
      onClick={() => setActiveDrawerSection('consumed')}
      sx={{ borderRadius: 8, flex: 1 }}
    >
      {t("orders.consumed")}
    </Button>
    <Button
      variant="outlined"
      onClick={() => setProductsModalOpen(true)}
      sx={{ borderRadius: 8, flex: 1 }}
    >
      {t("orders.addProducts")}
    </Button>
  </Stack>

  <Divider sx={{ my: 2 }} />

  {/* Sessões Condicionais */}
  {activeDrawerSection === 'edit' && (
    <EditComandaSection
      selectedComanda={selectedComanda}
      handleRenameComanda={handleRenameComanda}
      handleObservationChange={handleObservationChange}
    />
  )}

  {activeDrawerSection === 'consumed' && (
    <ConsumedProductsSection selectedComanda={selectedComanda} activeDrawerSection={activeDrawerSection} consumedProducts={consumedProducts}  />
  )}



  <Divider sx={{ my: 2 }} />

  {/* Botões de Ação */}
  <Stack direction="row" spacing={2}>
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handleSaveComanda}
      sx={{ borderRadius: 8, fontWeight: "bold" }}
    >
      {t("orders.save")}
    </Button>

    <Button
      fullWidth
      variant="outlined"
      onClick={() => setOpenDrawer(false)}
      sx={{ borderRadius: 8 }}
    >
      {t("orders.cancel")}
    </Button>
  </Stack>
</Drawer>
<ProductsSelectModal
  open={productsModalOpen}
  onClose={() => setProductsModalOpen(false)}
  companyId={activeCompany}
  orderId={selectedComanda?.id}
  onProductsAdded={async () => {
    const response = await OrdersService.get(activeCompany);
    setComandas(response.data);
    const updated = response.data.find(c => c.id === selectedComanda?.id);
    setSelectedComanda(updated);
  }}
/>
    </Box>
  );
};

export default Command;

