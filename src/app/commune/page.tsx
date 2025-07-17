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

  // Form states
  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);

  // Data
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

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
  const fetchCommunes = async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/communes",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunes(res.data);
    } catch {
      showNotification("Erreur de chargement des communes.", "error");
    }
  };

  // Load provinces
  const fetchProvinces = async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/provinces",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProvinces(res.data);
    } catch {
      showNotification("Erreur de chargement des provinces.", "error");
    }
  };

  useEffect(() => {
    fetchCommunes();
    fetchProvinces();
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
    if (!provinceId) {
      showNotification("Veuillez choisir la province.", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.patch(
          `http://localhost:8001/candidat-manager/api/v1/communes/${editId}`,
          { code, designation, provinceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Commune mise à jour avec succès !", "success");
      } else {
        await axios.post(
          "http://localhost:8001/candidat-manager/api/v1/communes",
          { code, designation, provinceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Commune ajoutée avec succès !", "success");
      }
      setFormOpen(false);
      resetForm();
      fetchCommunes();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(message, "error");
    }
  };

  const resetForm = () => {
    setCode("");
    setDesignation("");
    setProvinceId("");
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
        `http://localhost:8001/candidat-manager/api/v1/communes/${deleteTargetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Commune supprimée avec succès.", "success");
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
        Gestion des Communes
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          resetForm();
          setFormOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        {t("create_commune")}
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Désignation</TableCell>
              <TableCell>Province</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {communes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((commune) => (
                <TableRow key={commune.id}>
                  <TableCell>{commune.code}</TableCell>
                  <TableCell>{commune.designation}</TableCell>
                  <TableCell>{commune.province?.designation}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditId(commune.id);
                        setCode(commune.code);
                        setDesignation(commune.designation);
                        setProvinceId(commune.province.id);
                        setFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTargetId(commune.id);
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
          count={communes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? "Modifier une Commune" : "Ajouter une Commune"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="Désignation"
            fullWidth
            margin="normal"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="province-select-label">Province</InputLabel>
            <Select
              labelId="province-select-label"
              label="Province"
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value as number)}
            >
              {provinces.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
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
            Voulez-vous vraiment supprimer cette commune ?
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
