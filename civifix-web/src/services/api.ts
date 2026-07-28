import api, { unwrapResponse } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

export const complaintsApi = {
  updateStatus: async (id: string, status: string) => {
    const res = await api.put(`/complaints/${id}/status`, { status });
    return unwrapResponse(res);
  },
  
  addNote: async (id: string, payload: { text: string }) => {
    const res = await api.put(`/complaints/${id}/note`, payload);
    return unwrapResponse(res);
  },

  
  submitFeedback: async (id: string, data: any) => {
    const response = await api.put(ENDPOINTS.SUBMIT_FEEDBACK(id), null, { params: data });
    return response.data;
  },

  reopenComplaint: async (id: string, reason: string) => {
    const response = await api.put(ENDPOINTS.REOPEN_COMPLAINT(id), null, { params: { reason } });
    return response.data;
  },

  resolveComplaintWithImages: async (id: string, formData: FormData) => {
    const res = await api.put(`/inspector/complaints/${id}/resolve`, formData);
    return unwrapResponse(res);
  }
};

