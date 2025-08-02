"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
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

interface Province {
  id: number;
  designation: string;
}

interface Commune {
  id: number;
  code: string;
  designation: string;
  province: Province;
}

type Severity = "success" | "error" | "info" | "warning";

export default function CommunePage() {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);

  const [communes, setCommunes] = useState<Commune[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<Severity>("success");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const showNotification = (msg: string, severity: Severity) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => setSnackOpen(false);

  const fetchCommunes = useCallback(async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/communes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommunes(res.data);
    } catch {
      showNotification("Erreur de chargement des communes.", "error");
    }
  }, [API_URL, token]);

  const fetchProvinces = useCallback(async () => {
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/provinces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProvinces(res.data);
    } catch {
      showNotification("Erreur de chargement des provinces.", "error");
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchCommunes();
    fetchProvinces();
  }, [fetchCommunes, fetchProvinces]);

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
          `${API_URL}/communes/${editId}`,
          { code, designation, provinceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Commune mise à jour avec succès !", "success");
      } else {
        await axios.post(
          `${API_URL}/communes`,
          { code, designation, provinceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Commune ajoutée avec succès !", "success");
      }
      setFormOpen(false);
      resetForm();
      fetchCommunes();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(message, "error");
    }
  };

  const resetForm = () => {
    setCode("");
    setDesignation("");
    setProvinceId("");
    setEditId(null);
  };

  const handleDelete = async () => {
    if (!deleteTargetId || !token) return;

    try {
      await axios.delete(`${API_URL}/communes/${deleteTargetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Commune supprimée avec succès.", "success");
      setDeleteConfirmOpen(false);
      fetchCommunes();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("title_commune")}
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
        {t("create_commune")}
      </Button>

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
            size="small"
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
            <InputLabel id="province-select-label">Province</InputLabel>
            <Select
              labelId="province-select-label"
              label="Province"
              size="small"
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

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
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
