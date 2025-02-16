import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import LeadsService from "../../../services/leads.service.ts";

// Interface para os detalhes da submissão do formulário
interface FormDetail {
  id: string;
  formId: string;
  responseData: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
}

// Props para o modal
interface FormDetailsModalProps {
  open: boolean;
  formId: string;
  onClose: () => void;
}

const FormDetailsModal: React.FC<FormDetailsModalProps> = ({
  open,
  formId,
  onClose,
}) => {
  const [details, setDetails] = useState<FormDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      LeadsService.getFormsDetails(formId)
        .then((response) => {
          setDetails(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar detalhes do formulário:", error);
          setLoading(false);
        });
    }
  }, [open, formId]);

  // Extrai as chaves dinâmicas dos objetos responseData
  const dynamicKeys = Array.from(
    details.reduce((acc: Set<string>, detail) => {
      if (detail.responseData) {
        Object.keys(detail.responseData).forEach((key) => acc.add(key));
      }
      return acc;
    }, new Set<string>())
  ).filter(key => key !== "formId"); // Exclui o campo "formId"

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Detalhes do Formulário</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography variant="body2">Carregando...</Typography>
        ) : details.length === 0 ? (
          <Typography variant="body2">Nenhum dado encontrado.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {dynamicKeys.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.id}>
                  {dynamicKeys.map((key) => (
                    <TableCell key={key}>
                      {detail.responseData ? detail.responseData[key] || "" : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDetailsModal;
