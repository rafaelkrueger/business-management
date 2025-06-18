import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: Date;
  value: number;
  source: string;
  jsonData: Record<string, any>;
}

interface LeadDetailsModalProps {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ open, lead, onClose }) => {
  if (!lead) return null;

  const details: Record<string, any> = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    lastContact: lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : '',
    value: lead.value,
    source: lead.source,
    ...lead.jsonData
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lead Details</DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableBody>
            {Object.entries(details).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsModal;
