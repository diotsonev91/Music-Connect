import React from "react";
import TrackForm from "./TrackForm";
import TrackPage from "./TrackPage";


const UploadTrack = () => {
  return (
    <div>
      <h1>Upload a New Track</h1>
        <TrackPage showComments={false}/>
      <TrackForm onSubmitSuccess={() => console.log("Track uploaded successfully!")} />
    </div>
  );
};

export default UploadTrack;
