import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import * as userSelectionService from '../service/userSelectionService';

interface SelectionContextType {
  // State for tracking selected items
  selectedStyles: string[];
  selectedMaterials: string[];
  selectedNecklines: string[];
  selectedDetails: string[];
  selectedVeils: string[];
  selectedJewelry: string[];
  selectedHairpins: string[];
  selectedCrowns: string[];
  selectedFlowers: string[];
  
  // Actions
  toggleStyleSelection: (styleId: string) => Promise<void>;
  toggleMaterialSelection: (materialId: string) => Promise<void>;
  toggleNecklineSelection: (necklineId: string) => Promise<void>;
  toggleDetailSelection: (detailId: string) => Promise<void>;
  toggleVeilSelection: (veilId: string) => Promise<void>;
  toggleJewelrySelection: (jewelryId: string) => Promise<void>;
  toggleHairpinSelection: (hairpinId: string) => Promise<void>;
  toggleCrownSelection: (crownId: string) => Promise<void>;
  toggleFlowerSelection: (flowerId: string) => Promise<void>;
  
  // Save selections
  saveSelections: () => Promise<void>;
  
  // Create album
  createAlbum: () => Promise<void>;
  
  // Clear all selections
  clearSelections: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedNecklines, setSelectedNecklines] = useState<string[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [selectedVeils, setSelectedVeils] = useState<string[]>([]);
  const [selectedJewelry, setSelectedJewelry] = useState<string[]>([]);
  const [selectedHairpins, setSelectedHairpins] = useState<string[]>([]);
  const [selectedCrowns, setSelectedCrowns] = useState<string[]>([]);
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [hasExistingSelection, setHasExistingSelection] = useState<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef<boolean>(false);
  const needsResaveRef = useRef<boolean>(false);

  // Load existing selections on mount
  useEffect(() => {
    const loadExistingSelections = async () => {
      try {
        const response = await userSelectionService.getUserSelections();
        if (response.data && response.data.length > 0) {
          // Get the most recent selection (last one)
          const selection = response.data[response.data.length - 1];
          setSelectedStyles(selection.styles || []);
          setSelectedMaterials(selection.materials || []);
          setSelectedNecklines(selection.necklines || []);
          setSelectedDetails(selection.details || []);
          setSelectedVeils(selection.accessories?.veils || []);
          setSelectedJewelry(selection.accessories?.jewelries || []);
          setSelectedHairpins(selection.accessories?.hairpins || []);
          setSelectedCrowns(selection.accessories?.crowns || []);
          setSelectedFlowers(selection.flowers || []);
          setHasExistingSelection(true);
        }
      } catch (error) {
        console.error('Error loading existing selections:', error);
      }
    };

    loadExistingSelections();
  }, []);

  const toggleSelection = useCallback((items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>, itemId: string) => {
    setItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Helper function to save all current selections to API (single-flight)
  const saveAllSelections = useCallback(async () => {
    if (isSavingRef.current) {
      // If a save is in progress, mark to run again afterward
      needsResaveRef.current = true;
      return;
    }
    isSavingRef.current = true;
    try {
      // Check if we have any selections
      const hasSelections = selectedStyles.length > 0 || selectedMaterials.length > 0 || 
                           selectedNecklines.length > 0 || selectedDetails.length > 0 ||
                           selectedVeils.length > 0 || selectedJewelry.length > 0 ||
                           selectedHairpins.length > 0 || selectedCrowns.length > 0 ||
                           selectedFlowers.length > 0;

      // Always delete existing selections first to avoid duplicates
      try {
        await userSelectionService.deleteSelection();
      } catch (error: any) {
        // Only ignore 404/not-found; for other errors, abort to prevent duplicate creates
        const status = error?.response?.status;
        const message = error?.message;
        const isNotFound = status === 404 || message === "No pinned selection found";
        if (!isNotFound) {
          console.error('Delete selection failed, aborting save to avoid duplicates:', error);
          return; // do not create when delete failed for other reasons
        }
      }

      if (hasSelections) {
        // Create new selection with all current selections
        await userSelectionService.createSelection({
          styleIds: Array.from(new Set(selectedStyles)),
          materialIds: Array.from(new Set(selectedMaterials)),
          necklineIds: Array.from(new Set(selectedNecklines)),
          detailIds: Array.from(new Set(selectedDetails)),
          veilIds: Array.from(new Set(selectedVeils)),
          jewelryIds: Array.from(new Set(selectedJewelry)),
          hairpinIds: Array.from(new Set(selectedHairpins)),
          crownIds: Array.from(new Set(selectedCrowns)),
          flowerIds: Array.from(new Set(selectedFlowers)),
        });
        setHasExistingSelection(true);
      } else {
        setHasExistingSelection(false);
      }
    } catch (error) {
      console.error('Error saving selections:', error);
    } finally {
      isSavingRef.current = false;
      if (needsResaveRef.current) {
        needsResaveRef.current = false;
        // Run a follow-up save to capture the latest state
        // Avoid tight loops by scheduling on next tick
        setTimeout(() => {
          void saveAllSelections();
        }, 0);
      }
    }
  }, [selectedStyles, selectedMaterials, selectedNecklines, selectedDetails, selectedVeils, selectedJewelry, selectedHairpins, selectedCrowns, selectedFlowers]);

  // Debounce helper
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void saveAllSelections();
    }, 600);
  }, [saveAllSelections]);

  const toggleStyleSelection = useCallback(async (styleId: string) => {
    toggleSelection(selectedStyles, setSelectedStyles, styleId);
    scheduleSave();
  }, [selectedStyles, toggleSelection, scheduleSave]);

  const toggleMaterialSelection = useCallback(async (materialId: string) => {
    toggleSelection(selectedMaterials, setSelectedMaterials, materialId);
    scheduleSave();
  }, [selectedMaterials, toggleSelection, scheduleSave]);

  const toggleNecklineSelection = useCallback(async (necklineId: string) => {
    toggleSelection(selectedNecklines, setSelectedNecklines, necklineId);
    scheduleSave();
  }, [selectedNecklines, toggleSelection, scheduleSave]);

  const toggleDetailSelection = useCallback(async (detailId: string) => {
    toggleSelection(selectedDetails, setSelectedDetails, detailId);
    scheduleSave();
  }, [selectedDetails, toggleSelection, scheduleSave]);

  const toggleVeilSelection = useCallback(async (veilId: string) => {
    toggleSelection(selectedVeils, setSelectedVeils, veilId);
    scheduleSave();
  }, [selectedVeils, toggleSelection, scheduleSave]);

  const toggleJewelrySelection = useCallback(async (jewelryId: string) => {
    toggleSelection(selectedJewelry, setSelectedJewelry, jewelryId);
    scheduleSave();
  }, [selectedJewelry, toggleSelection, scheduleSave]);

  const toggleHairpinSelection = useCallback(async (hairpinId: string) => {
    toggleSelection(selectedHairpins, setSelectedHairpins, hairpinId);
    scheduleSave();
  }, [selectedHairpins, toggleSelection, scheduleSave]);

  const toggleCrownSelection = useCallback(async (crownId: string) => {
    toggleSelection(selectedCrowns, setSelectedCrowns, crownId);
    scheduleSave();
  }, [selectedCrowns, toggleSelection, scheduleSave]);

  const toggleFlowerSelection = useCallback(async (flowerId: string) => {
    toggleSelection(selectedFlowers, setSelectedFlowers, flowerId);
    scheduleSave();
  }, [selectedFlowers, toggleSelection, scheduleSave]);

  const saveSelections = useCallback(async () => {
    try {
      // First delete existing selection
      try {
        await userSelectionService.deleteSelection();
      } catch (error: any) {
        const status = error?.response?.status;
        const message = error?.message;
        const isNotFound = status === 404 || message === "No pinned selection found";
        if (!isNotFound) {
          throw error;
        }
      }
      
      // Then create new selection with all current selections
      await userSelectionService.createSelection({
        styleIds: selectedStyles,
        materialIds: selectedMaterials,
        necklineIds: selectedNecklines,
        detailIds: selectedDetails,
        veilIds: selectedVeils,
        jewelryIds: selectedJewelry,
        hairpinIds: selectedHairpins,
        crownIds: selectedCrowns,
        flowerIds: selectedFlowers,
      });
    } catch (error) {
      console.error('Error saving selections:', error);
      throw error;
    }
  }, [
    selectedStyles, selectedMaterials, selectedNecklines, selectedDetails,
    selectedVeils, selectedJewelry, selectedHairpins, selectedCrowns, selectedFlowers
  ]);

  const clearSelections = useCallback(() => {
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedNecklines([]);
    setSelectedDetails([]);
    setSelectedVeils([]);
    setSelectedJewelry([]);
    setSelectedHairpins([]);
    setSelectedCrowns([]);
    setSelectedFlowers([]);
    setHasExistingSelection(false);
  }, []);

  const createAlbum = useCallback(async () => {
    try {
      // Check if we have any selections
      const hasSelections = selectedStyles.length > 0 || selectedMaterials.length > 0 || 
                           selectedNecklines.length > 0 || selectedDetails.length > 0 ||
                           selectedVeils.length > 0 || selectedJewelry.length > 0 ||
                           selectedHairpins.length > 0 || selectedCrowns.length > 0 ||
                           selectedFlowers.length > 0;
      
      if (!hasSelections) {
        throw new Error('Vui lòng chọn ít nhất một mục để tạo album');
      }

      // Try to save selections first (optional - API might not be available)
      try {
        await saveSelections();
      } catch (error) {
        console.warn('Could not save selections to API, continuing with album creation:', error);
      }
      
      // Get existing albums to auto-generate name
      let albumCount = 0;
      try {
        const albumsResponse = await userSelectionService.getUserAlbums();
        albumCount = albumsResponse.data.length;
      } catch (error) {
        console.warn('Could not get existing albums, using default count:', error);
      }
      
      const albumName = `Album ${albumCount + 1}`;
      
      // Try to create album via API
      try {
        // Use current selections from state, not from database
        // First ensure selections are saved to database
        await saveSelections();
        
        // Then get the saved selection ID (should be only 1 now)
        const selectionsResponse = await userSelectionService.getUserSelections();
        
        // Only get the most recent selection
        const selectionIds = selectionsResponse.data.length > 0 
          ? [selectionsResponse.data[selectionsResponse.data.length - 1]._id]
          : [];
        
        if (selectionIds.length > 0) {
          await userSelectionService.createAlbum({
            name: albumName,
            selectionIds,
            note: `Album created with current selections: ${selectedStyles.length} styles, ${selectedMaterials.length} materials, ${selectedNecklines.length} necklines, ${selectedDetails.length} details, ${selectedVeils.length} veils, ${selectedJewelry.length} jewelry, ${selectedHairpins.length} hairpins, ${selectedCrowns.length} crowns, ${selectedFlowers.length} flowers`
          });
        } else {
          throw new Error('No selections found to create album');
        }
      } catch (error) {
        console.warn('Could not create album via API:', error);
        throw error;
      }
      
      // Clear selections after successful album creation
      clearSelections();
      
    } catch (error: any) {
      console.error('Error creating album:', error);
      throw new Error(error.message || 'Failed to create album');
    }
  }, [selectedStyles, selectedMaterials, selectedNecklines, selectedDetails, selectedVeils, selectedJewelry, selectedHairpins, selectedCrowns, selectedFlowers, saveSelections, clearSelections]);

  const value: SelectionContextType = {
    selectedStyles,
    selectedMaterials,
    selectedNecklines,
    selectedDetails,
    selectedVeils,
    selectedJewelry,
    selectedHairpins,
    selectedCrowns,
    selectedFlowers,
    toggleStyleSelection,
    toggleMaterialSelection,
    toggleNecklineSelection,
    toggleDetailSelection,
    toggleVeilSelection,
    toggleJewelrySelection,
    toggleHairpinSelection,
    toggleCrownSelection,
    toggleFlowerSelection,
    saveSelections,
    createAlbum,
    clearSelections,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
