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

export default function ProvincePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<Severity>("success");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const showNotification = (msg: string, severity: Severity) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => setSnackOpen(false);

  const fetchProvinces = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/provinces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProvinces(res.data);
    } catch {
      showNotification("Erreur de chargement des provinces.", "error");
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const extractErrorMessage = (error: unknown): string => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response === "object" &&
      (error as any).response !== null &&
      "data" in (error as any).response &&
      typeof (error as any).response.data === "object" &&
      (error as any).response.data !== null &&
      "message" in (error as any).response.data &&
      typeof (error as any).response.data.message === "string"
    ) {
      return (error as any).response.data.message;
    }
    if (error instanceof Error) return error.message;
    return "Erreur lors de l'enregistrement.";
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }

    try {
      if (editId) {
        await axios.patch(
          `${API_URL}/provinces/${editId}`,
          { code, designation },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Province mise à jour avec succès !", "success");
      } else {
        await axios.post(
          `${API_URL}/provinces`,
          { code, designation },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Province ajoutée avec succès !", "success");
      }
      setFormOpen(false);
      setCode("");
      setDesignation("");
      setEditId(null);
      fetchProvinces();
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showNotification(message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant.", "error");
      return;
    }

    try {
      await axios.delete(`${API_URL}/provinces/${deleteTargetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Province supprimée avec succès.", "success");
      setDeleteConfirmOpen(false);
      fetchProvinces();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("title_province")}
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
        {t("create_province")}
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("code")}</TableCell>
              <TableCell>{t("designation")}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provinces
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((province) => (
                <TableRow key={province.id}>
                  <TableCell>{province.code}</TableCell>
                  <TableCell>{province.designation}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditId(province.id);
                        setCode(province.code);
                        setDesignation(province.designation);
                        setFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTargetId(province.id);
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
          count={provinces.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog d'ajout/modification */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? t("edit_province") : t("add_province")}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t("code")}
            fullWidth
            size="small"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label={t("designation")}
            fullWidth
            size="small"
            margin="normal"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} size="small">
            {t("cancel")}
          </Button>
          <Button variant="contained" onClick={handleSave} size="small">
            {t("save")}
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
          <DialogContentText>{t("confirm_delete")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            {t("cancel")}
          </Button>
          <Button color="error" onClick={handleDelete}>
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notification */}
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
