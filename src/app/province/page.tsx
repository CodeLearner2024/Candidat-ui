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
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Data
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

  // Load all provinces
  const fetchProvinces = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:8001/candidat-manager/api/v1/provinces",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProvinces(res.data);
    } catch (err) {
      showNotification("Erreur de chargement des provinces.", "error");
    }
  };

  useEffect(() => {
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
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant. Connectez-vous.", "error");
      return;
    }

    try {
      if (editId) {
        await axios.patch(
          `http://localhost:8001/candidat-manager/api/v1/provinces/${editId}`,
          { code, designation },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Province mise à jour avec succès !", "success");
      } else {
        await axios.post(
          "http://localhost:8001/candidat-manager/api/v1/provinces",
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
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      showNotification(message, "error");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Token manquant.", "error");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8001/candidat-manager/api/v1/provinces/${deleteTargetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Province supprimée avec succès.", "success");
      setDeleteConfirmOpen(false);
      fetchProvinces();
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  // Handlers for pagination
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

      {/* Table */}
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

      {/* Add/Edit Dialog */}
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

      {/* Delete Confirmation Dialog */}
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
