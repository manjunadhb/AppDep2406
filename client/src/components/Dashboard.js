import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";

function Dashboard() {
  let dispatch = useDispatch();

  let storeObj = useSelector((store) => {
    return store.loginReducer;
  });

  let deleteProfile = async () => {
    let reqOptions = {
      method: "DELETE",
    };

    let url = `/deleteProfile?email=${storeObj.loginDetails.email}`;

    let JSONData = await fetch(url, reqOptions);

    let JSOData = await JSONData.json();

    alert(JSOData.msg);
  };

  return (
    <div>
      <TopNavigation />
      <h1>Dashboard</h1>
      <button
        onClick={() => {
          deleteProfile();
        }}
      >
        Delete Profile
      </button>
      <button
        onClick={() => {
          dispatch({ type: "assignTask", data: 1 });
        }}
      >
        Assign Task
      </button>
      <button
        onClick={() => {
          dispatch({ type: "submitTask", data: 2 });
        }}
      >
        Submit Task
      </button>
      <button
        onClick={() => {
          dispatch({ type: "approveTask", data: 3 });
        }}
      >
        Approve Task
      </button>
      <button
        onClick={() => {
          dispatch({ type: "rejectTask", data: 4 });
        }}
      >
        Reject Task
      </button>
      <br></br>
      <button
        onClick={() => {
          dispatch({ type: "applyLeave", data: 1 });
        }}
      >
        Apply Leave
      </button>
      <button
        onClick={() => {
          dispatch({ type: "rejectLeave", data: 2 });
        }}
      >
        Reject Leave
      </button>
      <button
        onClick={() => {
          dispatch({ type: "postponeLeave", data: 3 });
        }}
      >
        Postpone Leave
      </button>
      <button
        onClick={() => {
          dispatch({ type: "cancelLeave", data: 4 });
        }}
      >
        Cancel Leave
      </button>
      <h2>
        {storeObj && storeObj.loginDetails && storeObj.loginDetails.firstName
          ? storeObj.loginDetails.firstName
          : "Hi"}
        {storeObj && storeObj.loginDetails && storeObj.loginDetails.lastName
          ? storeObj.loginDetails.lastName
          : " Guest"}
      </h2>
      <img
        src={
          storeObj && storeObj.loginDetails && storeObj.loginDetails.profilePic
            ? `/${storeObj.loginDetails.profilePic}`
            : null
        }
      ></img>
    </div>
  );
}

export default Dashboard;
