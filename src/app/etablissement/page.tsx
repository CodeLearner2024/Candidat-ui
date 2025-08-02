"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

type Etablissement = {
  id: number;
  code: string;
  designation: string;
  zoneId: number;
};

type Province = {
  id: number;
  nom: string;
};

export default function Etablissements() {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [zoneId, setZoneId] = useState<number | "">("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/provinces"
      );
      setProvinces(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des provinces", error);
    }
  };

  const fetchEtablissements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/etablissements"
      );
      setEtablissements(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des établissements", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchEtablissements();
  }, [fetchProvinces, fetchEtablissements]);

  const resetForm = () => {
    setCode("");
    setDesignation("");
    setZoneId("");
    setEditMode(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant.", "error");
      return;
    }

    if (!code || !designation || !zoneId) {
      showNotification("Tous les champs sont requis.", "warning");
      return;
    }

    try {
      if (editMode && editingId) {
        await axios.put(
          `http://localhost:8001/candidat-manager/api/v1/etablissements/${editingId}`,
          { code, designation, zoneId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Établissement modifié avec succès.", "success");
      } else {
        await axios.post(
          "http://localhost:8001/candidat-manager/api/v1/etablissements",
          { code, designation, zoneId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Établissement ajouté avec succès.", "success");
      }

      fetchEtablissements();
      setFormOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Erreur :", err);
      const msg =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(msg, "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant.", "error");
      setDeleteConfirmOpen(false);
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8001/candidat-manager/api/v1/etablissements/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Établissement supprimé.", "success");
      fetchEtablissements();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (etab: Etablissement) => {
    setCode(etab.code);
    setDesignation(etab.designation);
    setZoneId(etab.zoneId);
    setEditMode(true);
    setEditingId(etab.id);
    setFormOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des Établissements
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setFormOpen(true)}
      >
        Ajouter un établissement
      </Button>
      <Box sx={{ mt: 3 }}>
        {etablissements.map((etab) => (
          <Box
            key={etab.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              p: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1">{etab.designation}</Typography>
              <Typography variant="body2" color="textSecondary">
                Code: {etab.code} | Zone: {etab.zoneId}
              </Typography>
            </Box>
            <Box>
              <IconButton
                color="primary"
                onClick={() => handleEdit(etab)}
                aria-label="modifier"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteId(etab.id);
                  setDeleteConfirmOpen(true);
                }}
                aria-label="supprimer"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modal d'ajout/modification */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
        <DialogTitle>
          {editMode ? "Modifier un établissement" : "Ajouter un établissement"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Désignation"
            fullWidth
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            margin="dense"
          />
          <TextField
            select
            label="Province"
            fullWidth
            value={zoneId}
            onChange={(e) => setZoneId(Number(e.target.value))}
            margin="dense"
          >
            {provinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.nom}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
