import apiClient from "../api/client";

export interface UserSelection {
  _id: string;
  styles: string[];
  materials: string[];
  necklines: string[];
  details: string[];
  accessories: {
    veils: string[];
    jewelries: string[];
    hairpins: string[];
    crowns: string[];
  };
  flowers: string[];
  isPinned: boolean;
}

export interface Album {
  _id: string;
  name: string;
  selections: UserSelection[];
  note?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create new selection when user pins items
export const createSelection = async (selectionData: {
  styleIds?: string[];
  materialIds?: string[];
  necklineIds?: string[];
  detailIds?: string[];
  veilIds?: string[];
  jewelryIds?: string[];
  hairpinIds?: string[];
  crownIds?: string[];
  flowerIds?: string[];
}): Promise<ApiResponse<UserSelection>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserSelection>>(
      "/user/selections",
      selectionData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in createSelection:", error);
    throw error;
  }
};

// Delete current selection when user unpins items
export const deleteSelection = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      "/user/selections"
    );
    return response.data;
  } catch (error: any) {
    // Only log error if it's not "No pinned selection found"
    if (error.message !== "No pinned selection found") {
      console.error("Error in deleteSelection:", error);
    }
    throw error;
  }
};

// Get user selections
export const getUserSelections = async (): Promise<
  ApiResponse<UserSelection[]>
> => {
  try {
    const response = await apiClient.get<ApiResponse<UserSelection[]>>(
      "/user/selections"
    );
    return response.data;
  } catch (error: any) {
    // console.error("Error in getUserSelections:", error);
    // Return empty array as fallback
    return {
      success: true,
      data: [],
    };
  }
};

// Create album
export const createAlbum = async (albumData: {
  name: string;
  selectionIds: string[];
  note?: string;
}): Promise<ApiResponse<Album>> => {
  try {
    const response = await apiClient.post<ApiResponse<Album>>(
      "/user/album",
      albumData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in createAlbum:", error);
    throw error;
  }
};

// Get user albums
export const getUserAlbums = async (): Promise<ApiResponse<Album[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Album[]>>("/user/albums");
    return response.data;
  } catch (error: any) {
    console.error("Error in getUserAlbums:", error);
    // Return empty array as fallback
    return {
      success: true,
      data: [],
    };
  }
};
