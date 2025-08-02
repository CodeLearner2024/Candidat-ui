"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";

type Severity = "error" | "warning" | "info" | "success";

type Province = {
  id: number;
  code: string;
  designation: string;
};

export default function SectionPage() {
  const { t } = useTranslation();

  // Etats pour le formulaire
  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Données
  const [filieres, setFilieres] = useState<Province[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<Severity>("success");

  // Dialogues
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // fetchFilieres mémorisé avec useCallback
  const fetchFilieres = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/filieres",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFilieres(res.data);
    } catch  {
      // On ignore l'erreur ici ou on peut la logger
      showNotification("Erreur de chargement des filieres.", "error");
    }
  }, []);

  // useEffect avec fetchFilieres en dépendance (fonction stable grâce à useCallback)
  useEffect(() => {
    fetchFilieres();
  }, [fetchFilieres]);

  // Helpers Snackbar
  const showNotification = (msg: string, severity: Severity) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSnackClose = () => setSnackOpen(false);

  // Sauvegarde (création ou mise à jour)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }

    try {
      if (editId) {
        await axios.patch(
          `http://localhost:8001/candidat-manager/api/v1/filieres/${editId}`,
          { code, designation },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Filiere mise à jour avec succès !", "success");
      } else {
        await axios.post(
          "http://localhost:8001/candidat-manager/api/v1/filieres",
          { code, designation },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Filiere ajoutée avec succès !", "success");
      }
      setFormOpen(false);
      setCode("");
      setDesignation("");
      setEditId(null);
      fetchFilieres();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(message, "error");
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant.", "error");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8001/candidat-manager/api/v1/filieres/${deleteTargetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Filiere supprimée avec succès.", "success");
      setDeleteConfirmOpen(false);
      fetchFilieres();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("title_section")}
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setCode("");
          setDesignation("");
          setEditId(null);
          setFormOpen(true);
        }}
        sx={{ mb: 2 }}
        size="small"
      >
        {t("create_filiere")}
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Désignation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filieres
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((filiere) => (
                <TableRow key={filiere.id}>
                  <TableCell>{filiere.code}</TableCell>
                  <TableCell>{filiere.designation}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditId(filiere.id);
                        setCode(filiere.code);
                        setDesignation(filiere.designation);
                        setFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTargetId(filiere.id);
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
          count={filieres.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialogues Add/Edit */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? "Modifier une Filiere" : "Ajouter une Filiere"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            margin="normal"
            size="small"
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

      {/* Dialoge confirmation suppression */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cette filiere ?
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
