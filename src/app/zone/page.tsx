"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  DialogContentText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";

export default function CommunePage() {
  const { t } = useTranslation();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Form states
  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [communeId, setCommuneId] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);

  // Data
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<Severity>("success");

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Load communes
  const fetchZones = async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/zones`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setZones(res.data);
    } catch {
      showNotification("Erreur de chargement des zones.", "error");
    }
  };

  // Load provinces
  const fetchCommunes = async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/communes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunes(res.data);
    } catch {
      showNotification("Erreur de chargement des communes.", "error");
    }
  };

  useEffect(() => {
    fetchZones();
    fetchCommunes();
  }, []);

  // Snackbar helpers
  const showNotification = (msg: string, severity: Severity) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSnackClose = () => setSnackOpen(false);

  // Save (create or update)
  const handleSave = async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    if (!communeId) {
      showNotification("Veuillez choisir la commune.", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.patch(
          `${API_URL}/zones/${editId}`,
          { code, designation, communeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Zone mise à jour avec succès !", "success");
      } else {
        await axios.post(
          `${API_URL}/zones`,
          { code, designation, communeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Zone ajoutée avec succès !", "success");
      }
      setFormOpen(false);
      resetForm();
      fetchZones();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(message, "error");
    }
  };

  const resetForm = () => {
    setCode("");
    setDesignation("");
    setCommuneId("");
    setEditId(null);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    if (!token) {
      showNotification("Token manquant.", "error");
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/zones/${deleteTargetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("zone supprimée avec succès.", "success");
      setDeleteConfirmOpen(false);
      fetchCommunes();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  // Pagination
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("title_zone")}
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          resetForm();
          setFormOpen(true);
        }}
        sx={{ mb: 2 }}
        size="small"
      >
        {t("create_zone")}
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Désignation</TableCell>
              <TableCell>Commune</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.code}</TableCell>
                  <TableCell>{zone.designation}</TableCell>
                  <TableCell>{zone.commune?.designation}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditId(zone.id);
                        setCode(zone.code);
                        setDesignation(zone.designation);
                        setCommuneId(zone.commune.id);
                        setFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTargetId(zone.id);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={zones.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? "Modifier une Zone" : "Ajouter une Zone"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            size="small"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="Désignation"
            fullWidth
            size="small"
            margin="normal"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="province-select-label">Commune</InputLabel>
            <Select
              labelId="province-select-label"
              label="Commune"
              size="small"
              value={communeId}
              onChange={(e) => setCommuneId(e.target.value as number)}
            >
              {communes.map((com) => (
                <MenuItem key={com.id} value={com.id}>
                  {com.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} size="small">
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSave} size="small">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cette zone ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button color="error" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {snackMessage}
          </pre>
        </Alert>
      </Snackbar>
    </Box>
  );
}
