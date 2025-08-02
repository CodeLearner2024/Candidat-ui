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
import "../i18n/i18n";
import { useTranslation } from "react-i18next";

const getUserRoleFromToken = (): string | null => {
  if (typeof window !== "undefined") {
    let storedRole = localStorage.getItem("role");
    if (!storedRole) {
      storedRole = "USER";
      localStorage.setItem("role", storedRole);
    }
    return storedRole.trim().toUpperCase();
  }
  return null;
};

const getUserLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "fr";
  }
  return "fr";
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
  { label: "Province", href: "/province" },
  { label: "Commune", href: "/commune" },
  { label: "Zone", href: "/zone" },
  { label: "Etablissement", href: "/etablissement" },
  { label: "Filiere", href: "/section" },
  { label: "Profession", href: "/profession" },
];

const userProfileMenuItems = [
  { label: "Mon Profil", href: "/profile" },
  { label: "Déconnexion", href: "/login" },
];

const Header = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLanguage(lang);
    setLangAnchorEl(null);
  };

  const [monDossierAnchorEl, setMonDossierAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("fr");

  const openMonDossier = Boolean(monDossierAnchorEl);
  const openSettings = Boolean(settingsAnchorEl);
  const openUserMenu = Boolean(userMenuAnchorEl);
  const openLangMenu = Boolean(langAnchorEl);

  useEffect(() => {
    const role = getUserRoleFromToken();
    const lang = getUserLanguage();
    setUserRole(role);
    setLanguage(lang);
  }, []);

  const roleNormalized = userRole ? userRole.trim().toUpperCase() : null;

  const isAdmin = roleNormalized === "ADMIN";
  const isAuthenticated = userRole !== null;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0D3D6A", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box mr={1}>
            <Image src="/logo.jpeg" alt="EFB Logo" width={80} height={60} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="white" lineHeight={1}>
              GB
            </Typography>
            <Typography variant="caption" sx={{ color: "red", fontWeight: "bold" }}>
              Burundi
            </Typography>
            <Typography variant="caption" sx={{ color: "white", display: "block" }}>
              {t("careerPath")}
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} passHref>
              <Button sx={{ color: "white", fontSize: "0.875rem", textTransform: "none" }}>
                {t(item.label)}
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
                sx={{ color: "white", fontSize: "0.875rem", textTransform: "none" }}
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
                  <MenuItem key={index} onClick={() => setMonDossierAnchorEl(null)}>
                    <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          {isAdmin && (
            <>
              <Button
                id="settings-button"
                aria-controls={openSettings ? "settings-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? "true" : undefined}
                onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
                sx={{ color: "white", fontSize: "0.875rem", textTransform: "none" }}
              >
                {t("settings")}
              </Button>
              <Menu
                id="settings-menu"
                anchorEl={settingsAnchorEl}
                open={openSettings}
                onClose={() => setSettingsAnchorEl(null)}
              >
                {settingsMenuItems.map((item, index) => (
                  <MenuItem key={index} onClick={() => setSettingsAnchorEl(null)}>
                    <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>

        {/* Avatar + Langue */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Menu Langue */}
              <Button onClick={(e) => setLangAnchorEl(e.currentTarget)} sx={{ color: "white", textTransform: "none" }}>
                {language.toUpperCase()}
              </Button>
              <Menu
                id="lang-menu"
                anchorEl={langAnchorEl}
                open={openLangMenu}
                onClose={() => setLangAnchorEl(null)}
              >
                <MenuItem onClick={() => handleLanguageChange("fr")}>Français</MenuItem>
                <MenuItem onClick={() => handleLanguageChange("en")}>English</MenuItem>
              </Menu>

              {/* Avatar utilisateur */}
              <IconButton onClick={(e) => setUserMenuAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src="/avatar.jpeg" />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchorEl}
                open={openUserMenu}
                onClose={() => setUserMenuAnchorEl(null)}
              >
                {userProfileMenuItems.map((item, index) => (
                  <MenuItem key={index} onClick={() => setUserMenuAnchorEl(null)}>
                    <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Link href="/login">
              <Button
                sx={{
                  color: "white",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  marginLeft: 2,
                }}
              >
                {t("login")}
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
