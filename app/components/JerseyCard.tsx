import React from "react";

function JerseyCard() {
  return (
    <div className="flex flex-col items-center justify-center dir h-screen bg-blue-400">
      <img src="/chelsea.jpg" alt="" width={200} />
      <h3>Team Name</h3>
      <p>Description</p>
    </div>
  );
}

export default JerseyCard;
