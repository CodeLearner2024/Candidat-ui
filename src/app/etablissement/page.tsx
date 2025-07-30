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
  DialogContentText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";



export default function EtablissementPage() {
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [communeId, setCommuneId] = useState<number | "">("");
  const [zoneId, setZoneId] = useState<number | "">("");

  const [provinces, setProvinces] = useState<
    Array<{ id: number; designation: string }>
  >([]);
  const [communes, setCommunes] = useState<
    Array<{ id: number; designation: string }>
  >([]);
  const [zones, setZones] = useState<
    Array<{ id: number; designation: string }>
  >([]);

  const [etablissements, setEtablissements] = useState<
    Array<{ id: number; code: string; designation: string; zoneId: number }>
  >([]);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  // Nouveaux états pour confirmation suppression
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const showNotification = (
    msg: string,
    severity: "success" | "error" | "warning"
  ) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSnackClose = () => setSnackOpen(false);

  const resetForm = () => {
    setCode("");
    setDesignation("");
    setProvinceId("");
    setCommuneId("");
    setZoneId("");
    setEditMode(false);
    setEditingId(null);
  };

  const fetchProvinces = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/provinces",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProvinces(res.data);
    } catch (err) {
      console.error("Erreur provinces:", err);
      showNotification("Erreur lors du chargement des provinces.", "error");
    }
  };

  const fetchCommunes = async (provinceId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        `http://localhost:8001/candidat-manager/api/v1/communes?provinceId=${provinceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunes(res.data);
    } catch (err) {
      showNotification("Erreur lors du chargement des communes.", "error");
    }
  };

  const fetchZones = async (communeId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        `http://localhost:8001/candidat-manager/api/v1/zones?communeId=${communeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setZones(res.data);
    } catch (err) {
      showNotification("Erreur lors du chargement des zones.", "error");
    }
  };

  const fetchEtablissements = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/etablissements",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEtablissements(res.data);
    } catch (err) {
      showNotification(
        "Erreur lors du chargement des établissements.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchEtablissements();
  }, []);

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
        showNotification("Etablissement modifié avec succès.", "success");
      } else {
        await axios.post(
          "http://localhost:8001/candidat-manager/api/v1/etablissements",
          { code, designation, zoneId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Etablissement ajouté avec succès.", "success");
      }

      fetchEtablissements();
      setFormOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Erreur :", err);
      const msg =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(msg, "error");
    }
  };

  // Nouveau handler ouverture du dialog confirmation suppression
  const openDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  // Handler suppression confirmé
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
    } catch (err) {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (etab: any) => {
    setCode(etab.code);
    setDesignation(etab.designation);
    setZoneId(etab.zoneId);
    setEditMode(true);
    setEditingId(etab.id);
    setFormOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("title_etablissement") || "Gestion des Etablissements"}
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
        {t("create_etablissement") || "Ajouter un établissement"}
      </Button>

      {/* Tableau des établissements */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Désignation</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {etablissements.map((etab) => (
              <TableRow key={etab.id}>
                <TableCell>{etab.code}</TableCell>
                <TableCell>{etab.designation}</TableCell>
                <TableCell>{etab.zoneId}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(etab)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => openDeleteConfirm(etab.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulaire de création/modification */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth>
        <DialogTitle>
          {editMode ? "Modifier un établissement" : "Ajouter un établissement"}
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
            <InputLabel id="province-label">Province</InputLabel>
            <Select
              labelId="province-label"
              value={provinceId}
              label="Province"
              size="small"
              onChange={(e) => {
                const selected = e.target.value as number;
                setProvinceId(selected);
                setCommuneId("");
                setZoneId("");
                setCommunes([]);
                setZones([]);
                fetchCommunes(selected);
              }}
            >
              {provinces.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!provinceId}>
            <InputLabel id="commune-label">Commune</InputLabel>
            <Select
              labelId="commune-label"
              value={communeId}
              label="Commune"
              size="small"
              onChange={(e) => {
                const selected = e.target.value as number;
                setCommuneId(selected);
                setZoneId("");
                setZones([]);
                fetchZones(selected);
              }}
            >
              {communes.map((com) => (
                <MenuItem key={com.id} value={com.id}>
                  {com.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!communeId}>
            <InputLabel id="zone-label">Zone</InputLabel>
            <Select
              labelId="zone-label"
              value={zoneId}
              label="Zone"
              size="small"
              onChange={(e) => setZoneId(e.target.value as number)}
            >
              {zones.map((zone) => (
                <MenuItem key={zone.id} value={zone.id}>
                  {zone.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? "Modifier" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation suppression */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet établissement ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} size="small">
            Annuler
          </Button>
          <Button color="error" onClick={handleDeleteConfirm} size="small">
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
