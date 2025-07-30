"use client";

import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// Fonction pour lire ou définir un rôle par défaut
const getUserRoleFromToken = (): string | null => {
  if (typeof window !== "undefined") {
    let storedRole = localStorage.getItem("role");

    // Si aucun rôle n'est stocké, on le définit à "USER" par défaut
    if (!storedRole) {
      storedRole = "USER"; // ou "ADMIN"
      localStorage.setItem("role", storedRole);
    }

    // Nettoyage : suppression des espaces et mise en majuscule
    return storedRole.trim().toUpperCase();
  }

  return null;
};

const menuItems = [
  { label: "ACCUEIL", href: "/acceuil" },
  { label: "A propos", href: "/propos" },
];

const monDossierMenuItems = [
  { label: "Mon Dossier", href: "/etablissement" },
  { label: "Appel", href: "/pedagogie" },
  { label: "Aide", href: "/inscriptions" },
  { label: "Yes", href: "/vie-scolaire" },
  { label: "Yes", href: "/informations" },
];

const settingsMenuItems = [
  { label: "Province", href: "/" },
  { label: "Commune", href: "/etablissement" },
  { label: "Zone", href: "/pedagogie" },
  { label: "Etablissement", href: "/inscriptions" },
  { label: "Filiere", href: "/section" },
  { label: "Profession", href: "/informations" },
];

const userProfileMenuItems = [
  { label: "Mon Profil", href: "/profile" },
  { label: "Déconnexion", href: "/login" },
];

const Header = () => {
  const [monDossierAnchorEl, setMonDossierAnchorEl] =
    useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [userRole, setUserRole] = useState<string | null>(null);

  const openMonDossier = Boolean(monDossierAnchorEl);
  const openSettings = Boolean(settingsAnchorEl);
  const openUserMenu = Boolean(userMenuAnchorEl);

  useEffect(() => {
    const role = getUserRoleFromToken();
    console.log("Rôle utilisateur connecté :", role);
    setUserRole(role);
  }, []);

  // Normalisation du rôle pour comparaison
  const roleNormalized = userRole ? userRole.trim().toUpperCase() : null;

  const isAdmin = roleNormalized === "ADMIN";
  const isUser = roleNormalized === "USER";
  const isAuthenticated = userRole !== null;

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#0D3D6A", boxShadow: "none" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo */}
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

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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

          {isAuthenticated && (
            <>
              <Button
                id="mon-dossier-button"
                aria-controls={openMonDossier ? "mon-dossier-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMonDossier ? "true" : undefined}
                onClick={(e) => setMonDossierAnchorEl(e.currentTarget)}
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
                onClose={() => setMonDossierAnchorEl(null)}
              >
                {monDossierMenuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setMonDossierAnchorEl(null)}
                  >
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
            </>
          )}

          {/* Affiche seulement si ADMIN */}
          {isAdmin && (
            <>
              <Button
                id="settings-button"
                aria-controls={openSettings ? "settings-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? "true" : undefined}
                onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
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
                onClose={() => setSettingsAnchorEl(null)}
              >
                {settingsMenuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setSettingsAnchorEl(null)}
                  >
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
            </>
          )}
        </Box>

        {/* Avatar utilisateur */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <Avatar alt="User Profile" src="/avatar.jpeg" />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchorEl}
                open={openUserMenu}
                onClose={() => setUserMenuAnchorEl(null)}
              >
                {userProfileMenuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setUserMenuAnchorEl(null)}
                  >
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
            </>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <Button
                component="a"
                sx={{
                  color: "white",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  marginLeft: 2,
                }}
              >
                CONNEXION
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
