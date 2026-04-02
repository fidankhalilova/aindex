// hooks/useFavorites.ts
"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/types";

type Visibility = "private" | "public";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Tool[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("userFavorites");
    const savedVisibility = localStorage.getItem(
      "favoritesVisibility",
    ) as Visibility | null;

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites");
      }
    }

    if (savedVisibility) {
      setVisibility(savedVisibility);
    }

    setIsLoaded(true);
  }, []);

  // Save favorites
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("userFavorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // Save visibility
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("favoritesVisibility", visibility);
    }
  }, [visibility, isLoaded]);

  const addToFavorites = (tool: Tool) => {
    if (!favorites.some((fav) => fav.id === tool.id)) {
      setFavorites((prev) => [...prev, tool]);
      return true;
    }
    return false;
  };

  const removeFromFavorites = (toolId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== toolId));
  };

  const toggleFavorite = (tool: Tool) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === tool.id);
    if (isAlreadyFavorite) {
      removeFromFavorites(tool.id);
      return false;
    } else {
      addToFavorites(tool);
      return true;
    }
  };

  const isFavorite = (toolId: number) =>
    favorites.some((fav) => fav.id === toolId);

  const toggleVisibility = () => {
    setVisibility((prev) => (prev === "private" ? "public" : "private"));
  };

  return {
    favorites,
    visibility,
    toggleVisibility,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
};
