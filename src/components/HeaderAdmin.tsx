"use client";

import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Menu avec libellé et lien
const menuItems = [
  { label: "Province", href: "/" },
  { label: "Commune", href: "/etablissement" },
  { label: "Zone", href: "/pedagogie" },
  { label: "Etablissement", href: "/inscriptions" },
  { label: "Filiere", href: "/vie-scolaire" },
  { label: "Profession", href: "/informations" },
  { label: "CONNEXION", href: "/login" },
];

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0D3D6A", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo gauche */}
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
              Parcours Professionnel
            </Typography>
          </Box>
        </Box>

        {/* Menu navigation */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} passHref legacyBehavior>
              <Button
                component="a"
                sx={{ color: "white", fontSize: "0.875rem", textTransform: "none" }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
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
