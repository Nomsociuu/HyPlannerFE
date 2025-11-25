import apiClient from "../api/client";

export interface Album {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    picture?: string;
    email?: string;
  };
  name: string;
  selections: any[];
  images?: string[];
  description?: string;
  note?: string;
  isPublic: boolean;
  totalVotes: number;
  totalSaves: number;
  averageRating: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumData {
  name: string;
  selections?: string[];
  images?: string[];
  description?: string;
  note?: string;
  isPublic?: boolean;
}

export interface UpdateAlbumData {
  name?: string;
  selections?: string[];
  images?: string[];
  description?: string;
  note?: string;
  isPublic?: boolean;
}

// Lấy tất cả albums công khai
export const getAllAlbums = async (
  page: number = 1,
  limit: number = 20
): Promise<any> => {
  const response = await apiClient.get(`/albums?page=${page}&limit=${limit}`);
  return response.data;
};

// Lấy albums của user hiện tại
export const getMyAlbums = async (): Promise<Album[]> => {
  const response = await apiClient.get("/albums/my-albums");
  return response.data.albums;
};

// Lấy featured albums (Inspire Board)
export const getFeaturedAlbums = async (
  limit: number = 10
): Promise<Album[]> => {
  const response = await apiClient.get(`/albums/featured?limit=${limit}`);
  return response.data.albums;
};

// Lấy album theo ID
export const getAlbumById = async (albumId: string): Promise<Album> => {
  const response = await apiClient.get(`/albums/${albumId}`);
  return response.data.album;
};

// Tạo album mới
export const createAlbum = async (data: CreateAlbumData): Promise<Album> => {
  const response = await apiClient.post("/albums", data);
  return response.data.album;
};

// Cập nhật album
export const updateAlbum = async (
  albumId: string,
  data: UpdateAlbumData
): Promise<Album> => {
  const response = await apiClient.put(`/albums/${albumId}`, data);
  return response.data.album;
};

// Xóa album
export const deleteAlbum = async (albumId: string): Promise<void> => {
  await apiClient.delete(`/albums/${albumId}`);
};

// Thêm selection vào album
export const addSelectionToAlbum = async (
  albumId: string,
  selectionId: string
): Promise<Album> => {
  const response = await apiClient.post(`/albums/${albumId}/add-selection`, {
    selectionId,
  });
  return response.data.album;
};

// Xóa selection khỏi album
export const removeSelectionFromAlbum = async (
  albumId: string,
  selectionId: string
): Promise<Album> => {
  const response = await apiClient.post(`/albums/${albumId}/remove-selection`, {
    selectionId,
  });
  return response.data.album;
};
