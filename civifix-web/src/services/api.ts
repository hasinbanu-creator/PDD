import api, { unwrapResponse } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

export const complaintsApi = {
  updateStatus: async (id: string, status: string) => {
    const res = await api.put(`/complaints/${id}/status`, { status });
    return unwrapResponse(res);
  },
  
  addNote: async (id: string, payload: { text: string }) => {
    const res = await api.post(`/inspector/complaints/${id}/notes`, { note: payload.text });
    return unwrapResponse(res);
  },

  
  getFeedback: async (id: string) => {
    const response = await api.get(ENDPOINTS.SUBMIT_FEEDBACK(id));
    return response.data;
  },

  submitFeedback: async (id: string, data: any) => {
    const response = await api.post(ENDPOINTS.SUBMIT_FEEDBACK(id), data);
    return response.data;
  },


  resolveComplaintWithImages: async (id: string, formData: FormData) => {
    const res = await api.put(`/inspector/complaints/${id}/resolve`, formData);
    return unwrapResponse(res);
  }
};

