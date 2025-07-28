"use client";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentFormDialog() {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
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

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    identityNumber: "",
    birthDate: "",
    gender: "MALE",
    maritalStatus: "MARRIED",
    zoneId: 1,
    parentRequests: [
      {
        nomPapa: "",
        nomMaman: "",
        fonctionPapa: "",
        fonctionMaman: "",
        contactParent: "",
      },
    ],
    etudeFaiteRequests: [
      {
        description: "",
        periodeDebut: "",
        periodeFin: "",
        etablissementId: 1,
        niveauEtude: "HUMANITE",
        filiereId: 1,
      },
    ],
    formationFaitesFaiteRequests: [
      {
        description: "",
        periodeDebut: "",
        periodeFin: "",
        organisateurFormation: "",
      },
    ],
    experienceRequests: [],
  });

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
  useEffect(() => {
    fetchProvinces();
    fetchEtablissements();
  }, []);

  const handleChange = (e: any, section = null, index = 0) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][name] = value;
      setFormData((prev) => ({
        ...prev,
        [section]: updatedSection,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8001/candidat-manager/api/v1/etudiants",
        formData
      );
      alert("Enregistré avec succès !");
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Ajouter étudiant
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Enregistrement d'un étudiant</DialogTitle>
        <DialogContent dividers>
          {/* Informations personnelles en haut */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <TextField
              label="Prénom"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              label="Nom"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              label="Téléphone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              label="N° identité"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              select
              name="gender"
              label="Genre"
              value={formData.gender}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            >
              <MenuItem value="MALE">Homme</MenuItem>
              <MenuItem value="FEMALE">Femme</MenuItem>
            </TextField>
            <TextField
              select
              name="maritalStatus"
              label="État civil"
              value={formData.maritalStatus}
              onChange={handleChange}
              size="small"
              sx={{ flexBasis: "30%" }}
            >
              <MenuItem value="SINGLE">Célibataire</MenuItem>
              <MenuItem value="MARRIED">Marié(e)</MenuItem>
            </TextField>
          </Box>

          {/* Onglets en bas */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Parents" />
            <Tab label="Études" />
            <Tab label="Formations" />
            <Tab label="Expériences" />
          </Tabs>

          {tabIndex === 0 && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <TextField
                label="Nom du père"
                name="nomPapa"
                value={formData.parentRequests[0].nomPapa}
                onChange={(e) => handleChange(e, "parentRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="Nom de la mère"
                name="nomMaman"
                value={formData.parentRequests[0].nomMaman}
                onChange={(e) => handleChange(e, "parentRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="Fonction du père"
                name="fonctionPapa"
                value={formData.parentRequests[0].fonctionPapa}
                onChange={(e) => handleChange(e, "parentRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="Fonction de la mère"
                name="fonctionMaman"
                value={formData.parentRequests[0].fonctionMaman}
                onChange={(e) => handleChange(e, "parentRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="Contact parent"
                name="contactParent"
                value={formData.parentRequests[0].contactParent}
                onChange={(e) => handleChange(e, "parentRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="province-label">Province</InputLabel>
                <Select
                  labelId="province-label"
                  value={provinceId}
                  label="Province"
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
                  onChange={(e) => setZoneId(e.target.value as number)}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <TextField
                label="Description"
                name="description"
                value={formData.etudeFaiteRequests[0].description}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                type="date"
                label="Début"
                name="periodeDebut"
                value={formData.etudeFaiteRequests[0].periodeDebut}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                type="date"
                label="Fin"
                name="periodeFin"
                value={formData.etudeFaiteRequests[0].periodeFin}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="ID Établissement"
                name="etablissementId"
                value={formData.etudeFaiteRequests[0].etablissementId}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
              />
              <TextField
                label="Niveau d'étude"
                name="niveauEtude"
                value={formData.etudeFaiteRequests[0].niveauEtude}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="ID Filière"
                name="filiereId"
                value={formData.etudeFaiteRequests[0].filiereId}
                onChange={(e) => handleChange(e, "etudeFaiteRequests", 0)}
                sx={{ flexBasis: "30%" }}
                size="small"
              />
            </Box>
          )}

          {tabIndex === 2 && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <TextField
                label="Description"
                name="description"
                value={formData.formationFaitesFaiteRequests[0].description}
                onChange={(e) =>
                  handleChange(e, "formationFaitesFaiteRequests", 0)
                }
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                type="date"
                label="Début"
                name="periodeDebut"
                value={formData.formationFaitesFaiteRequests[0].periodeDebut}
                onChange={(e) =>
                  handleChange(e, "formationFaitesFaiteRequests", 0)
                }
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                type="date"
                label="Fin"
                name="periodeFin"
                value={formData.formationFaitesFaiteRequests[0].periodeFin}
                onChange={(e) =>
                  handleChange(e, "formationFaitesFaiteRequests", 0)
                }
                sx={{ flexBasis: "30%" }}
                size="small"
              />
              <TextField
                label="Organisateur"
                name="organisateurFormation"
                value={
                  formData.formationFaitesFaiteRequests[0].organisateurFormation
                }
                onChange={(e) =>
                  handleChange(e, "formationFaitesFaiteRequests", 0)
                }
                size="small"
                sx={{ flexBasis: "30%" }}
              />
            </Box>
          )}

          {tabIndex === 3 && (
            <Typography variant="body2" color="text.secondary">
              À compléter si tu veux gérer les expériences professionnelles.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
