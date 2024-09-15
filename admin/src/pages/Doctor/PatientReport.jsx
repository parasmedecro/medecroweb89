import React, { useState, useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function Report() {
    const { id } = useParams();
    const { backendUrl } = useContext(AppContext);
    const { dToken, profileData, getProfileData } = useContext(DoctorContext);

    const [file, setFile] = useState(null);
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);
        setAnalyzed(false);
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/report`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    dToken
                },
            });
            setResults(response.data);
            setAnalyzed(true);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const handleResultChange = (key, field, value) => {
        if (typeof value === 'string' && field === '') {
            setResults((prevResults) => ({
                ...prevResults,
                [key]: value,
            }));
        } else {
            setResults((prevResults) => ({
                ...prevResults,
                [key]: {
                    ...prevResults[key],
                    [field]: value,
                },
            }));
        }
    };

    const renderResultFields = (key, value) => {
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={key} className="mb-4 p-4 border rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-green-800">{key}</h3>
                    {Object.entries(value).map(([field, fieldValue]) => (
                        <div key={`${key}-${field}`} className="mb-2 flex items-center">
                            <label className="block text-sm font-medium text-gray-700">{field}</label>
                            <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => handleResultChange(key, field, e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-lg shadow-md"
                                onClick={() => saveToDb({ key, field, value: fieldValue })}
                            >
                                Save to DB
                            </button>
                        </div>
                    ))}
                </div>
            );
        } else if (typeof value === 'string') {
            return (
                <div key={key} className="mb-4 p-4 border rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-green-800">{key}</h3>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleResultChange(key, '', e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-lg shadow-md"
                            onClick={() => saveToDb({ key, value })}
                        >
                            add
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderFilePreview = () => {
        if (file) {
            if (file.type === 'application/pdf') {
                return (
                    <object
                        data={URL.createObjectURL(file)}
                        type="application/pdf"
                        className="w-full h-full" // Ensure it covers the full space
                        style={{ width: '100%', height: '100%' }} // Explicit height and width for object
                    >
                        <p>Your browser does not support PDFs. Please download the PDF to view it:</p>
                        <a href={URL.createObjectURL(file)}>Download PDF</a>
                    </object>
                );
            }
            if (file.type.startsWith('image/')) {
                return <img src={URL.createObjectURL(file)} alt="Uploaded Preview" className="w-full h-full object-contain" />;
            }
        }
        return null;
    };

    const saveToDb = (data) => {
        toast.success("Added to patient Database.")
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-green-50 to-green-100 text-gray-900 px-4 md:px-8 lg:px-16">
            {/* Title Section */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mt-10 mb-6 lg:mb-10">
                Report Analysis
            </h1>

            {/* File Upload Section */}
            <section className="w-full max-w-lg mb-8">
                <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col items-center">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="mb-4 p-3 w-full border border-green-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!file || isLoading}
                            className={`px-4 py-2 md:px-6 md:py-3 w-full text-white font-semibold rounded-lg shadow-lg focus:outline-none ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 transition-all duration-200'
                                }`}
                        >
                            {isLoading ? 'Processing...' : 'Upload and Analyze'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Document Preview and Analysis Section */}
            {analyzed && (
                <div className="flex w-full space-x-4">
                    {/* Document Preview Section */}
                    <div className="w-1/2 h-screen bg-white shadow-lg rounded-lg mr-4 flex flex-col">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Document Preview</h2>
                        <div className="flex-grow h-full">
                            {file && renderFilePreview()}
                        </div>
                    </div>

                    {/* Analysis/Results Section */}
                    <section className="w-1/2 max-w-lg mb-10">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Add to Patient Data</h2>
                        {Object.entries(results).map(([key, value]) => (
                            <div
                                key={key}
                                className="mb-4 p-4 bg-white border-l-4 border-green-600 shadow-md rounded-lg"
                            >
                                {renderResultFields(key, value)}
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
}

export default Report;
