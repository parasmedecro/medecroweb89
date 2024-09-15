import React, { useEffect, useState, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const PatientProfile = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [userData, setPatientData] = useState(null); // Manage patient data locally
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { dToken } = useContext(DoctorContext);
  const { loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const [image, setImage] = useState(false);

  const handleAddPrescription = () => {
    const urlParts = id

    navigate(`/prescription/${urlParts}`);
  };
  const handleAddReport = () => {
    const urlParts = id
    // Redirect to the new URL
    navigate(`/report/${urlParts}`);
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", id);
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-uprofile",
        formData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/doctor/patient/${id}`,
          { headers: { dToken } }
        ); // Replace with actual API call
        console.log(response)
        setPatientData(response.data);
      } catch (error) {
        toast.error("Failed to fetch patient data");
      }
    };
    fetchPatientData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setPatientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setPatientData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value,
      },
    }));
  };

  return userData ? (
    <div className="max-w-lg flex flex-col gap-4 text-sm pt-5 bg-white p-6 shadow-lg rounded-lg w-full">

      {isEdit ? (
        <label htmlFor="image">
          <div className="relative w-36 h-36 mx-auto">
            <img
              className="w-full h-full rounded-full object-cover opacity-75 transition-all hover:opacity-100"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />
            <img
              className="w-10 absolute bottom-2 right-2 cursor-pointer"
              src={image ? "" : assets.upload_icon}
              alt="Upload"
            />
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img
          className="w-36 h-36 rounded-full object-cover mx-auto"
          src={userData.image}
          alt="Profile"
        />
      )}

      <div className="text-center">
        {isEdit ? (
          <input
            className="bg-gray-100 text-3xl font-semibold p-2 rounded-lg border focus:border-primary transition-all w-full"
            style={{ height: "3.5rem" }}
            type="text"
            onChange={(e) => handleInputChange("name", e.target.value)}
            value={userData.name}
          />
        ) : (
          <p
            className="font-semibold text-3xl text-[#262626] mt-4 w-full"
            style={{
              height: "3.5rem",
              lineHeight: "3.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userData.name}
          </p>
        )}
      </div>

      <hr className="bg-gray-300 h-[1px] my-4" />

      <div>
        <p className="text-gray-500 font-medium underline mb-2">
          CONTACT INFORMATION
        </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-3 text-gray-600">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-600">{userData.email}</p>
          <p className="font-medium">Phone:</p>

          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg border focus:border-primary transition-all w-full"
              style={{ height: "2.5rem" }}
              type="text"
              onChange={(e) => handleInputChange("phone", e.target.value)}
              value={userData.phone}
            />
          ) : (
            <p
              className="text-blue-600"
              style={{ height: "2.5rem", lineHeight: "2.5rem" }}
            >
              {userData.phone}
            </p>
          )}

          <p className="font-medium">Address:</p>

          {isEdit ? (
            <div>
              <input
                className="bg-gray-100 w-full p-2 rounded-lg border mb-2 focus:border-primary transition-all"
                style={{ height: "2.5rem" }}
                type="text"
                onChange={(e) => handleAddressChange("line1", e.target.value)}
                value={userData.address.line1}
              />
              <input
                className="bg-gray-100 w-full p-2 rounded-lg border focus:border-primary transition-all"
                style={{ height: "2.5rem" }}
                type="text"
                onChange={(e) => handleAddressChange("line2", e.target.value)}
                value={userData.address.line2}
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1} <br /> {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-gray-500 font-medium underline mb-2">
          BASIC INFORMATION
        </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>

          {isEdit ? (
            <select
              className="bg-gray-100 p-2 rounded-lg border focus:border-primary transition-all w-full"
              style={{ height: "2.5rem" }}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              value={userData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p
              className="text-gray-500"
              style={{ height: "2.5rem", lineHeight: "2.5rem" }}
            >
              {userData.gender}
            </p>
          )}

          <p className="font-medium">Birthday:</p>

          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg border focus:border-primary transition-all w-full"
              style={{ height: "2.5rem" }}
              type="date"
              onChange={(e) => handleInputChange("dob", e.target.value)}
              value={userData.dob}
            />
          ) : (
            <p
              className="text-gray-500"
              style={{ height: "2.5rem", lineHeight: "2.5rem" }}
            >
              {userData.dob}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-primary text-white px-8 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-all"
          >
            Save information
          </button>
        ) : (
          <div className=" mb-4 flex justify-between">
            <button
              onClick={() => setIsEdit(true)}
              className="border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>

            <button
              onClick={handleAddPrescription}
              className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-all"
            >
              Add Prescription
            </button>
            <button
              onClick={handleAddReport}
              className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-all"
            >
              Analyze Report
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default PatientProfile;
