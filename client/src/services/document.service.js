const API_URL = "http://localhost:5000/api/documents";

// ================================
// Get All Documents
// ================================

export const getAllDocuments = async () => {

    const response = await fetch(API_URL);

    const data = await response.json();

    return data;

};

// ================================
// Get Single Document
// ================================

export const getDocumentById = async (id) => {

    const response = await fetch(`${API_URL}/${id}`);

    const data = await response.json();

    return data;

};

// ================================
// Upload Document
// ================================

export const uploadDocument = async (formData) => {

    const response = await fetch(API_URL, {

        method: "POST",

        body: formData,

    });

    const data = await response.json();

    return data;

};

// ================================
// Update Document
// ================================

export const updateDocument = async (id, formData) => {

    const response = await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        body: formData,

    });

    const data = await response.json();

    return data;

};

// ================================
// Delete Document
// ================================

export const deleteDocument = async (id) => {

    const response = await fetch(`${API_URL}/${id}`, {

        method: "DELETE",

    });

    const data = await response.json();

    return data;

};