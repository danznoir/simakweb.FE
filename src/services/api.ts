
const BASE_URL = 'http://localhost:3000/api/v1';
const getAuthToken = () => localStorage.getItem('token') || '';

const fetchWrapper = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || `API Request Failed: ${response.statusText}`,
      };
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error; 
  }
};

export const AuthAPI = {
  login: (data: any) => fetchWrapper('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchWrapper('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data: any) => fetchWrapper('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  resendOtp: (data: any) => fetchWrapper('/auth/send-otp', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => fetchWrapper('/users'),
};


export const SantriAPI = {
  getAll: () => fetchWrapper('/users'),
  getById: (id: string) => fetchWrapper(`/users/${id}`),
  create: (data: any) => fetchWrapper('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchWrapper(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const WaliAPI = {
  getSantriByWali: (waliId: string) => fetchWrapper(`/wali-santri/${waliId}`),
  assignWaliToSantri: (data: { wali_id: string; santri_id: string; relation_type: string }) => 
    fetchWrapper('/relasi', { method: 'POST', body: JSON.stringify(data) }),
};

export const DivisiAPI = {
  getAll: () => fetchWrapper('/divisions'),
  create: (data: any) => fetchWrapper('/divisions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchWrapper(`/divisions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const ClassAPI = {
  getAll: () => fetchWrapper('/classes'),
  getById: (id: string) => fetchWrapper(`/classes/${id}`),
  getByDivisi: (divisiId: string) => fetchWrapper(`/divisions/${divisiId}/classes`),
  create: (data: any) => fetchWrapper('/classes', { method: 'POST', body: JSON.stringify(data) }),
};

export const AttendanceAPI = {
  submitAttendance: (data: any) => fetchWrapper('/attendances', { method: 'POST', body: JSON.stringify(data) }),
  getByClass: (classId: string) => fetchWrapper(`/classes/${classId}/attendances`),
  getBySantri: (santriId: string) => fetchWrapper(`/santri/${santriId}/attendances`),
};

export const AssignmentAPI = {
  create: (data: any) => fetchWrapper('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getByClass: (classId: string) => fetchWrapper(`/classes/${classId}/assignments`),
  delete: (id: string) => fetchWrapper(`/assignments/${id}`, { method: 'DELETE' }),
};

export const SubmissionAPI = {
  submitTask: (assignmentId: string, data: any) => 
    fetchWrapper(`/submissions`, { method: 'POST', body: JSON.stringify({ ...data, assignment_id: assignmentId }) }),
  getSubmissionsByAssignment: (assignmentId: string) => fetchWrapper(`/submissions?assignment_id=${assignmentId}`),
  gradeSubmission: (submissionId: string, payload: { score: number; mentor_feedback: string }) => 
    fetchWrapper(`/submissions/${submissionId}/grade`, { method: 'PUT', body: JSON.stringify(payload) }),
};

export default {
  AuthAPI,
  SantriAPI,
  WaliAPI,
  DivisiAPI,
  ClassAPI,
  AttendanceAPI,
  AssignmentAPI,
  SubmissionAPI,
};
