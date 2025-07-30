"use client";

import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// Menu principal avec libellé et lien
const menuItems = [
  { label: "ACCUEIL", href: "/acceuil" },
  { label: "A propos", href: "/propos" },
  { label: "CONNEXION", href: "/login" },
];

// Sous-menus pour "Settings"
const settingsMenuItems = [
  { label: "Province", href: "/" },
  { label: "Commune", href: "/etablissement" },
  { label: "Zone", href: "/pedagogie" },
  { label: "Etablissement", href: "/inscriptions" },
  { label: "Filiere", href: "/section" },
  { label: "Profession", href: "/informations" },
];

// Sous-menus pour "Mon Dossier"
const monDossierMenuItems = [
  { label: "Mon Dossier", href: "/etablissement" },
  { label: "Appel", href: "/pedagogie" },
  { label: "Aide", href: "/inscriptions" },
  { label: "Yes", href: "/vie-scolaire" },
  { label: "Yes", href: "/informations" },
];

const Header = () => {
  // État pour le menu "Settings"
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const openSettings = Boolean(settingsAnchorEl);

  // État pour le menu "Mon Dossier"
  const [monDossierAnchorEl, setMonDossierAnchorEl] = useState(null);
  const openMonDossier = Boolean(monDossierAnchorEl);

  // Gestionnaires pour le menu "Settings"
  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  // Gestionnaires pour le menu "Mon Dossier"
  const handleMonDossierClick = (event) => {
    setMonDossierAnchorEl(event.currentTarget);
  };

  const handleMonDossierClose = () => {
    setMonDossierAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#0D3D6A", boxShadow: "none" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo gauche */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box mr={1}>
            <Image src="/logo.jpeg" alt="EFB Logo" width={80} height={60} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="white"
              lineHeight={1}
            >
              GB
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "red", fontWeight: "bold" }}
            >
              Burundi
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "white", display: "block" }}
            >
              Parcours Professionnel
            </Typography>
          </Box>
        </Box>

        {/* Menu navigation */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Menu principal */}
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} passHref legacyBehavior>
              <Button
                component="a"
                sx={{
                  color: "white",
                  fontSize: "0.875rem",
                  textTransform: "none",
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}

          {/* Bouton du menu déroulant Settings */}
          <Button
            id="settings-button"
            aria-controls={openSettings ? "settings-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openSettings ? "true" : undefined}
            onClick={handleSettingsClick}
            sx={{
              color: "white",
              fontSize: "0.875rem",
              textTransform: "none",
            }}
          >
            Settings
          </Button>
          <Menu
            id="settings-menu"
            anchorEl={settingsAnchorEl}
            open={openSettings}
            onClose={handleSettingsClose}
            MenuListProps={{
              "aria-labelledby": "settings-button",
            }}
          >
            {settingsMenuItems.map((item, index) => (
              <MenuItem key={index} onClick={handleSettingsClose}>
                <Link href={item.href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              </MenuItem>
            ))}
          </Menu>

          {/* Bouton du menu déroulant Mon Dossier */}
          <Button
            id="mon-dossier-button"
            aria-controls={openMonDossier ? "mon-dossier-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMonDossier ? "true" : undefined}
            onClick={handleMonDossierClick}
            sx={{
              color: "white",
              fontSize: "0.875rem",
              textTransform: "none",
            }}
          >
            Mon Dossier
          </Button>
          <Menu
            id="mon-dossier-menu"
            anchorEl={monDossierAnchorEl}
            open={openMonDossier}
            onClose={handleMonDossierClose}
            MenuListProps={{
              "aria-labelledby": "mon-dossier-button",
            }}
          >
            {monDossierMenuItems.map((item, index) => (
              <MenuItem key={index} onClick={handleMonDossierClose}>
                <Link href={item.href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Logo AEFE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.jpeg" alt="AEFE Logo" width={80} height={60} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
